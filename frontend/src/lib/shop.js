import { loadFile, shopNames } from './utils';
import { newRandomItem } from './item';

class Shop {
    constructor(shopName, shopLevel = 0, cityLevel = 0, partyLevel = 1, reputation = 0, template = "") {
        this.shopName = shopName;
        this.shopLevel = Math.max(0, Math.min(10, parseFloat(shopLevel.toFixed(2))));
        this.cityLevel = Math.max(0, Math.min(5, parseInt(cityLevel)));
        this.partyLevel = Math.max(1, Math.min(20, parseInt(partyLevel)));
        this.reputation = Math.max(-10, Math.min(10, parseFloat(reputation.toFixed(2))));
        this.stock = [];
        this.gold = 0;
        this.hoursCounter = 0;
        this.arcaneChance = 0.7;
        this.template(template);
    }

    async template(template) {
        const shopTypes = loadFile("shops");
        const typeNames = shopNames(true);
        this.shopType = typeNames.includes(template) ? template : "";
        const shop = shopTypes.Type.find(type => type.Name === this.shopType);
        if (!shop) {
            // Handle case where shop type is not found
            return;
        }
        this.shopLevel = Math.max(this.shopLevel, shop["Min level"]);
        this.gold = this.baseGold(this.partyLevel, this.shopLevel);
        this.itemMod = shop.Modifier;
        if (shop["Arcane Chance"]) {
            this.arcaneChance = shop["Arcane Chance"];
        }
        if ("Weapon" in this.itemMod && this.itemMod.Weapon > 0) {
            this.itemMod.Ammo = this.itemMod.Weapon * 0.6;
        }
        if ("Armor" in this.itemMod && this.itemMod.Armor > 0) {
            this.itemMod.Shield = this.itemMod.Armor * 0.4;
        }
        this.generateInventory();
    }

    deserialize(fileName) {
        const data = loadFile(fileName);
        if (!this.validJson(data)) return false;
        this.shopName = data.shopName;
        this.shopLevel = data.Shop;
        this.cityLevel = data.City;
        this.partyLevel = data.Party;
        this.reputation = data.Reputation;
        this.stock = data.Stock;
        this.gold = data.Gold;
        this.hoursCounter = data.Time;
        this.arcaneChance = data.Arcane;
        this.shopType = data.Type;
        this.itemMod = data.Modifier;
        return true;
    }

    async generateInventory() {
        this.stock = [];
        for (const key in this.itemMod) {
            for (let i = 0; i < this.modItemNumber(key); i++) {
                const newItem = newRandomItem(key, this.shopLevel, this.partyLevel, this.arcaneChance);
                this.addItem(newItem, key);
            }
        }
        const invValue = () => this.stock.reduce((total, item) => total + item.Cost, 0) * 0.95;
        this.sortByCost();
        while (invValue() > this.gold - 100) {
            if (this.stock.length > 0) {
                this.stock.pop();
            }
        }
        this.gold -= invValue();
        this.sortByType();
    }

    addItem(addedItem, itemType) {
        if (addedItem && addedItem.Cost !== undefined) {
            let found = false;
            for (let item of this.stock) {
                if (item.Name === addedItem.Name) {
                    item.number += 1;
                    found = true;
                    break;
                }
            }
            if (!found) {
                addedItem.priceModifier = Math.floor(Math.random() * 41) - 20;
                addedItem.number = 1;
                addedItem.itemType = itemType;
                this.stock.push(addedItem);
            }
        }
    }

    baseGold(partyLevel, shopLevel) {
        return Math.floor(1000 * Math.pow(partyLevel, 1.5) * Math.pow(1.1, shopLevel));
    }

    sortByType() {
        this.stock.sort((a, b) => a.Name.localeCompare(b.Name));
        this.stock.sort((a, b) => a.itemType.localeCompare(b.itemType));
    }

    sortByCost() {
        this.stock.sort((a, b) => a.Cost - b.Cost);
    }

    validJson(data) {
        if (!data || typeof data !== "object") return false;
        const requiredKeys = ["Name", "Shop", "City", "Party", "Reputation", "Stock", "Gold", "Time", "Arcane", "Type", "Modifier"];
        return requiredKeys.every(key => key in data);
    }

    addShopLevel(lv) {
        const shopLv = this.shopLevel;
        const lvSum = this.shopLevel + lv;
        this.shopLevel = Math.round(Math.max(this.shopLevel, Math.min(10, lvSum)) * 100) / 100;
        const oldGold = this.baseGold(this.partyLevel, shopLv);
        const newGold = this.baseGold(this.partyLevel, this.shopLevel);
        this.gold += newGold - oldGold;
        if (parseInt(shopLv) !== parseInt(this.shopLevel)) {
            console.log(`${this.shopName} has reached level ${parseInt(this.shopLevel)}!`);
        }
    }

    addCityLevel(lv) {
        this.cityLevel = Math.max(0, Math.min(5, this.cityLevel + lv));
    }

    addPartyLevel(lv) {
        const partyLv = this.partyLevel;
        const addLv = this.partyLevel + lv;
        this.partyLevel = Math.max(this.partyLevel, Math.min(20, addLv));
        const oldGold = this.baseGold(partyLv, this.shopLevel);
        const newGold = this.baseGold(this.partyLevel, this.shopLevel);
        this.gold += newGold - oldGold;
    }

    addReputation(rep) {
        this.reputation = Math.round(Math.max(-10, Math.min(10, this.reputation + rep)) * 100) / 100;
    }

    passingTime(hours = 0, days = 0) {
        for (let i = 0; i < hours + days * 24; i++) {
            this.hoursCounter++;
            // Invest some gold and gain levels
            if (this.gold > this.baseGold(this.partyLevel, this.shopLevel)) {
                this.gold *= 0.9;
                this.addShopLevel(0.01 * (10 - this.shopLevel));
            }
            // Spend a little amount of gold per day
            this.gold -= Math.random() < 0.66 ? 0 : 1;
            // Restock items every 3 days
            if (this.hoursCounter % (24 * 3) === 0) {
                this.restock();
            }
            if (this.isOpen()) {
                this.sellSomething();
            }
        }
    }

    sellSomething() {
        const itemNumber = this.stock.reduce((acc, item) => acc + item.number, 0);
        if (Math.random() < itemNumber / 10) { // If have < 10 items, may sell nothing
            const num = Math.floor(Math.random() * Math.max(itemNumber / 10, 1));
            for (let i = 0; i < num; i++) {
                const itemsPossessed = this.stock.filter(item => item.number > 0);
                const item = { ...itemsPossessed[Math.floor(Math.random() * itemsPossessed.length)] };
                for (let selledItem of this.stock) {
                    if (selledItem.name === item.name) {
                        selledItem.number -= 1;
                        this.gold += this.trueCost(selledItem, false);
                    }
                }
            }
        }
    }

    isOpen() {
        return (
            this.hoursCounter % 24 > 8 && this.hoursCounter % 24 < 18 && // Opening time 9 - 18
            this.hoursCounter % 24 !== 13 && // Lunch break 13 - 14
            this.hoursCounter % 168 <= 144 // Day off every 7 days
        );
    }

    restock() {
        for (let key in this.itemMod) {
            const itemNumber = this.modItemNumber(key);
            if (this.countItemType(key) < itemNumber) {
                for (let i = 0; i < itemNumber - this.countItemType(key); i++) {
                    const item = this.newItem(key, this.shopLevel, this.partyLevel, this.arcaneChance);
                    if (item && item.name && this.gold - 100 >= item.cost * 0.95) {
                        console.log(`Restocked: ${item.name}`);
                        this.addItem(item, key);
                        this.gold -= item.cost * 0.95;
                    }
                }
            }
        }
        this.sortByType();
    }

    countItemType(itemType) {
        return this.stock.filter(item => item.itemType === itemType).reduce((acc, item) => acc + item.number, 0);
    }

    modItemNumber(key) {
        let num = this.itemMod[key];
        num *= Math.pow(1.1, this.partyLevel);
        num *= 1 + 0.1 * this.cityLevel;
        num *= Math.pow(1.05, this.shopLevel);
        return Math.floor(num + (Math.random() < num - Math.floor(num) ? 1 : 0));
    }

    trueCost(item, forParty = true) {
        const rep = forParty ? this.reputation * 2 : 0;
        const mod = (100 + item.priceModifier - rep + this.cityLevel) / 100;
        let cost = Math.max(Math.round(item.cost * mod), 0);
        const dec = cost < 100 ? 1 : cost < 1000 ? 5 : 10;
        return cost < 1 ? cost : Math.round(cost / dec) * dec;
    }
}

export default Shop;
