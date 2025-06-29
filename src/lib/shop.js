import { newRandomItem } from './item';
import { cap, loadFile, newGuid, shopTypes } from './utils';

const BASE_ARCANE_CHANCE = 0.7;
const REQUIRED_KEYS = ['Id', 'Name', 'Level', 'CityLevel', 'PlayerLevel', 'Reputation', 'Stock', 'Gold', 'Time', 'ArcaneChance', 'ShopType', 'ItemModifier'];

class Shop {

    //#region ctor

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
        this.ItemModifier = { ...shop.Modifier };
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
        this.ItemModifier = { ...data.ItemModifier };

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

        this.sortByCost();
        while (this.getInventoryValue() > this.Gold * 0.85 && this.Stock.length > 1) {
            this.Stock.pop();
        }
        this.setGold(Math.max(this.Gold - this.getInventoryValue(), Math.random() * 200));
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

    modItemNumber(key) {
        let num = this.ItemModifier[key];
        num *= 1 + 0.1 * (this.PlayerLevel - 1);
        num *= 1 + 0.1 * (this.CityLevel - 1);
        num *= 1 + 0.05 * this.Level;
        return Math.floor(num + (Math.random() < num - Math.floor(num) ? 1 : 0));
    }

    baseGold(PlayerLevel, Level) {
        return Math.floor(1000 * Math.pow(PlayerLevel, 1.4) * Math.pow(1.1, Level));
    }

    //#endregion

    //#region get / set

    getInventory() {
        return this.Stock.map(item => ({
            ...item,
            Cost: this.trueCost(item, true)
        }));
    }

    getInventoryValue() {
        return this.Stock.reduce((total, item) => total + this.trueCost(item, false), 0) * 0.95;
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
        lv = Math.max(0, Math.min(10, lv.toFixed(2)));
        const shopLv = this.Level ?? 0;
        this.Level = lv;
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

    trueCost(item, forParty = true) {
        const rep = forParty ? this.Reputation * 2 : 0;
        const mod = (100 + item.PriceModifier - rep + this.CityLevel) / 100;
        let cost = Math.max((parseFloat(item.Cost) * mod), 0.01);
        const dec = cost < 100 ? 1 : (cost < 1000 ? 5 : 10);
        return parseFloat(cost < 1 ? cost.toFixed(2) : Math.round(cost / dec) * dec);
    }

    setGold(gold) {
        if (gold == null || typeof gold !== 'number' || isNaN(gold)) {
            if (this.Gold == null || typeof this.Gold !== 'number' || isNaN(this.Gold)) {
                this.Gold = parseInt(Math.random() * 20);
            }
            return;
        }

        if (gold < 0) {
            this.Gold = parseInt(Math.random() * 20);
            return;
        }

        const isFloat = Number(gold) === gold && gold % 1 !== 0;
        this.Gold = isFloat ? parseFloat(gold.toFixed(2)) : Math.floor(gold);
    }

    //#endregion

    //#region time

    passingTime(hours = 0, days = 0) {
        const time = Math.min(hours + days * 24, 7 * 24); // max 1 week for performance reason
        for (let i = 0; i < time; i++) {
            this.Time++;
            if (this.Stock && this.Stock?.length !== 0) {
                // Invest some Gold and gain levels
                if (this.Gold > this.baseGold(this.PlayerLevel, this.Level)) {
                    this.setGold(this.Gold * 0.9);
                    this.setShopLevel(this.Level + 0.01 * (10 - parseInt(this.Level)));
                }
                // Spend a little amount of Gold per day
                this.setGold(this.Gold - (this.Time % 3 === 0 ? 1 : 0));
                this.sellSomething();
                // ReStock items every day
                if (this.Time % 24 === 0) {
                    this.reStock();
                }
            }
        }
        this.sortByType();
    }

    sellSomething() {
        const itemNumber = this.getInventory().reduce((acc, item) => acc + item.Number, 0);
        if (Math.random() > 0.5) return; // 50% sell nothing
        if (Math.random() >= itemNumber / 10) return; // If have < 10 items, may sell nothing
        let num = Math.floor(Math.random() * Math.max(itemNumber / 10, 1));
        if (num === 0 && Math.random() <= 0.03 && itemNumber > 3) {
            num = 1; // 3% to sell something in any case
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

    reStock() {
        for (let key in this.ItemModifier) {
            const itemNumber = this.modItemNumber(key);
            const itemsPossessed = this.countItemType(key);
            if (itemsPossessed >= itemNumber) return;
            for (let i = 0; i < itemNumber - itemsPossessed; i++) {
                if (this.baseGold(this.PlayerLevel, this.Level) * 0.15 > this.Gold) {
                    break;
                }
                const item = newRandomItem(key, this.Level, this.PlayerLevel, this.ArcaneChance);
                if (item && item.Name) {
                    this.addItem(item, key);
                    this.setGold(this.Gold - item.Cost * 0.8);
                }
            }
        }
        this.sortByType();
    }

    countItemType(itemType) {
        return this.Stock.filter(item => item.ItemType === itemType).reduce((acc, item) => acc + item.Number, 0);
    }

    //#endregion

    //#region buy / sell

    buy(itemName, itemType, cost = 1, number = 1) {
        if (itemName.trim() === '' || number <= 0) return;
        let updatedInventory = [...this.Stock];
        const savedName = itemName.length > 64 ? cap(itemName).slice(0, 64) : cap(itemName);
        const savedCost = Math.min(Math.max(parseFloat(cost).toFixed(2), 1), 999999999);
        const savedNumber = Math.min(Math.max(parseInt(number), 0), 99);
        const itemIndex = updatedInventory.findIndex(
            (item) => item.Name === savedName && item.ItemType === itemType
        );

        if (itemIndex !== -1) {
            const updatedItem = { ...updatedInventory[itemIndex] };
            updatedItem.Number += savedNumber;
            updatedInventory[itemIndex] = updatedItem;
            this.setGold(this.Gold - this.trueCost(updatedItem) * savedNumber);
        } else {
            const newItem = {
                Name: savedName,
                ItemType: itemType,
                Cost: savedCost,
                Number: savedNumber,
                PriceModifier: 0
            };
            updatedInventory.push(newItem);
            this.setGold(this.Gold - savedCost * savedNumber);
        }

        this.Stock = updatedInventory;
        this.sortByType();
    }

    sell(itemName, itemType, num = 1) {
        let updatedInventory = [...this.Stock];
        const itemIndex = updatedInventory.findIndex(
            (item) => item.Name === cap(itemName) && item.ItemType === itemType
        );

        if (itemIndex === -1) return;

        const updatedItem = { ...updatedInventory[itemIndex] };
        updatedItem.Number = Math.max(0, updatedItem.Number - num);
        updatedInventory[itemIndex] = updatedItem;

        this.setGold(this.Gold + this.trueCost(updatedItem) * num);
        this.Stock = updatedInventory;
    }

    serialize() {
        return {
            Id: this.Id,
            Name: this.Name,
            Level: this.Level,
            CityLevel: this.CityLevel,
            PlayerLevel: this.PlayerLevel,
            Reputation: this.Reputation,
            Stock: this.Stock,
            Gold: this.Gold,
            Time: this.Time,
            ArcaneChance: this.ArcaneChance,
            ShopType: this.ShopType,
            ItemModifier: this.ItemModifier,
        };
    }
}

export default Shop;
