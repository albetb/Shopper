import { loadFile, shopTypes, cap, newGuid } from './utils';
import { newRandomItem } from './item';

const BASE_ARCANE_CHANCE = 0.7;
const REQUIRED_KEYS = ['Id', 'Name', 'Level', 'CityLevel', 'PlayerLevel', 'Reputation', 'Stock', 'Gold', 'Time', 'ArcaneChance', 'ShopType', 'ItemModifier'];

class Shop {
    constructor(name = '', cityLevel = 0, playerLevel = 1) {
        this.Id = newGuid();
        this.Name = name;
        this.setGold(0);
        this.setShopLevel(0);
        this.setCityLevel(cityLevel);
        this.setPlayerLevel(playerLevel);
        this.setReputation(0);
        this.Stock = [];
        this.Time = 0;
        this.ArcaneChance = BASE_ARCANE_CHANCE;
        this.template();
    }

    template() {
        const tables = loadFile('tables');
        const shop = tables['Shop Types'].find(type => type.Name === (this.ShopType ?? 'None'));

        this.ShopType = shop.Name;
        this.Level = Math.max(this.Level, shop['Min level']);
        this.setGold(this.baseGold(this.PlayerLevel, this.Level));
        this.ItemModifier = shop.Modifier;
        this.ArcaneChance = shop['Arcane Chance'] ?? BASE_ARCANE_CHANCE;
        this.ItemModifier.Ammo = (this.ItemModifier.Weapon ?? 0) * 0.6;
        this.ItemModifier.Shield = (this.ItemModifier.Armor ?? 0) * 0.4;
    }

    load(data) {
        if (typeof data !== 'object' || data === null ||
            !REQUIRED_KEYS.every(key => data.hasOwnProperty(key))) {
            return null;
        }

        this.Id = data.Id;
        this.Name = data.Name;
        this.Level = data.Level;
        this.CityLevel = data.CityLevel;
        this.PlayerLevel = data.PlayerLevel;
        this.Reputation = data.Reputation;
        this.Stock = data.Stock;
        this.Gold = data.Gold;
        this.Time = data.Time;
        this.ArcaneChance = data.ArcaneChance;
        this.ShopType = data.ShopType;
        this.ItemModifier = data.ItemModifier;

        return this;
    }

    generateInventory() {
        this.Stock = [];
        for (const key in this.ItemModifier) {
            for (let i = 0; i < this.modItemNumber(key); i++) {
                const newItem = newRandomItem(key, this.Level, this.PlayerLevel, this.ArcaneChance);
                this.addItem(newItem, key);
            }
        }
        const invValue = () => this.Stock.reduce((total, item) => total + item.Cost, 0) * 0.95;
        this.sortByCost();
        while (invValue() > this.Gold - 100) {
            if (this.Stock.length > 0) {
                this.Stock.pop();
            }
        }
        this.setGold(this.Gold - invValue());
        this.sortByType();
    }

    getInventory() {
        return this.Stock.map(item => ({
            ...item,
            Cost: this.trueCost(item, true)
        }));
    }

    baseGold(PlayerLevel, Level) {
        return Math.floor(1000 * Math.pow(PlayerLevel, 1.5) * Math.pow(1.1, Level));
    }

    sortByType() {
        this.Stock.sort((a, b) => a.Name.localeCompare(b.Name));
        this.Stock.sort((a, b) => a.ItemType.localeCompare(b.ItemType));
    }

    sortByCost() {
        this.Stock.sort((a, b) => a.Cost - b.Cost);
    }

    setPlayerLevel(lv) {
        const partyLv = this.PlayerLevel;
        this.PlayerLevel = Math.max(1, Math.min(99, parseInt(lv)));
        const oldGold = this.baseGold(partyLv, this.Level);
        const newGold = this.baseGold(this.PlayerLevel, this.Level);
        this.setGold(this.Gold + newGold - oldGold);
    }

    setCityLevel(lv) {
        this.CityLevel = Math.max(0, Math.min(5, lv));
    }

    setShopLevel(lv) {
        const shopLv = this.Level ?? 0;
        this.Level = Math.max(0, Math.min(10, lv.toFixed(2)));
        const oldGold = this.baseGold(this.PlayerLevel, shopLv);
        const newGold = this.baseGold(this.PlayerLevel, lv);
        this.setGold(this.Gold + newGold - oldGold);
    }

    setReputation(rep) {
        this.Reputation = Math.max(-10, Math.min(10, rep));
    }

    setShopType(shopType) {
        this.ShopType = shopTypes().includes(shopType) ? shopType : 'None';
    }

    setGold(gold) {
        if (gold == null || typeof gold !== 'number' || isNaN(gold)) {
            if (this.Gold == null || typeof this.Gold !== 'number' || isNaN(this.Gold)) {
                this.Gold = 0;
            }
            return;
        }

        if (gold < 0) {
            this.Gold = 0;
            return;
        }

        const isFloat = Number(gold) === gold && gold % 1 !== 0;
        this.Gold = isFloat ? parseFloat(gold.toFixed(2)) : Math.floor(gold);
    }

    passingTime(hours = 0, days = 0) {
        for (let i = 0; i < hours + days * 24; i++) {
            this.Time++;
            if (this.Stock && this.Stock?.length !== 0) {
                // Invest some Gold and gain levels
                if (this.Gold > this.baseGold(this.PlayerLevel, this.Level)) {
                    this.setGold(this.Gold * 0.9);
                    this.setShopLevel(this.Level + 0.1 * (10 - parseInt(this.Level)));
                }
                // Spend a little amount of Gold per day
                this.setGold(this.Gold - (Math.random() < 0.66 ? 0 : 1));
                this.sellSomething();
                // ReStock items every day
                if (this.Time % 24 === 0) {
                    this.reStock();
                }
            }
        }
    }

    sell(itemName, itemType) {
        let updatedInventory = [...this.Stock];
        const itemIndex = updatedInventory.findIndex(
            (item) => item.Name === cap(itemName) && item.ItemType === itemType
        );

        if (itemIndex === -1) return;

        const updatedItem = { ...updatedInventory[itemIndex] };
        updatedItem.Number = Math.max(0, updatedItem.Number - 1);
        updatedInventory[itemIndex] = updatedItem;

        this.setGold(this.Gold + this.trueCost(updatedItem));
        this.Stock = updatedInventory;
    }

    sellSomething() {
        const itemNumber = this.getInventory().reduce((acc, item) => acc + item.Number, 0);
        if (Math.random() >= itemNumber / 10) return; // If have < 10 items, may sell nothing
        let num = Math.floor(Math.random() * Math.max(itemNumber / 10, 1));
        if (num === 0 && Math.random() <= 0.03) {
            num = 1;
        }
        for (let i = 0; i < num; i++) {
            const itemsPossessed = this.Stock.filter(item => item.Number > 0);
            const item = { ...itemsPossessed[Math.floor(Math.random() * itemsPossessed.length)] };
            for (let selledItem of this.Stock) {
                if (selledItem.Name === item.Name) {
                    selledItem.Number -= 1;
                    this.setGold(this.Gold + this.trueCost(selledItem, false));
                }
            }
        }
    }

    buy(itemName, itemType, cost = 1, number = 1) {
        if (itemName.trim() === '' || number <= 0) return;
        let updatedInventory = [...this.Stock];
        const itemIndex = updatedInventory.findIndex(
            (item) => item.Name === cap(itemName) && item.ItemType === itemType
        );

        if (itemIndex !== -1) {
            const updatedItem = { ...updatedInventory[itemIndex] };
            updatedItem.Number += parseInt(number);
            updatedInventory[itemIndex] = updatedItem;
            this.setGold(this.Gold - this.trueCost(updatedItem));
        } else {
            const newItem = {
                Name: cap(itemName),
                ItemType: itemType,
                Cost: Math.max(parseFloat(cost).toFixed(2), 1),
                Number: parseInt(number),
                PriceModifier: 0
            };
            updatedInventory.push(newItem);
            this.setGold(this.Gold - cost);
        }

        this.Stock = updatedInventory;
        this.sortByType();
    }

    addItem(addedItem, itemType) {
        if (addedItem && addedItem.Cost !== undefined) {
            let found = false;
            for (let item of this.Stock) {
                if (item.Name === addedItem.Name) {
                    item.Number += 1;
                    found = true;
                    break;
                }
            }
            if (!found) {
                addedItem.PriceModifier = Math.floor(Math.random() * 41) - 20;
                addedItem.Number = 1;
                addedItem.ItemType = itemType;
                this.Stock.push(addedItem);
            }
        }
    }

    reStock() {
        for (let key in this.ItemModifier) {
            const itemNumber = this.modItemNumber(key);
            if (this.countItemType(key) >= itemNumber) return;
            for (let i = 0; i < itemNumber - this.countItemType(key); i++) {
                const item = newRandomItem(key, this.Level, this.PlayerLevel, this.ArcaneChance);
                if (item && item.Name && this.Gold - 100 >= item.Cost * 0.95) {
                    this.addItem(item, key);
                    this.setGold(this.Gold - item.Cost * 0.9);
                }
            }
        }
        this.sortByType();
    }

    countItemType(itemType) {
        return this.Stock.filter(item => item.itemType === itemType).reduce((acc, item) => acc + item.number, 0);
    }

    modItemNumber(key) {
        let num = this.ItemModifier[key];
        num *= Math.pow(1.1, this.PlayerLevel);
        num *= 1 + 0.1 * this.CityLevel;
        num *= Math.pow(1.05, this.Level);
        return Math.floor(num + (Math.random() < num - Math.floor(num) ? 1 : 0));
    }

    trueCost(item, forParty = true) {
        const rep = forParty ? this.Reputation * 2 : 0;
        const mod = (100 + item.PriceModifier - rep + this.CityLevel) / 100;
        let cost = Math.max((parseFloat(item.Cost) * mod), 0.01);
        const dec = cost < 100 ? 1 : (cost < 1000 ? 5 : 10);
        return parseFloat(cost < 1 ? cost.toFixed(2) : Math.round(cost / dec) * dec);
    }
}

export default Shop;
