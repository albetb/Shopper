import * as db from './storage';
import { newGuid } from './utils';

const REQUIRED_KEYS = ['Id', 'Name', 'Level', 'PlayerLevel', 'SelectedShop', 'Shops'];

class City {
    constructor(name = '', playerLevel = 1) {
        this.Id = newGuid();
        this.Name = name;
        this.Level = 0;
        this.PlayerLevel = playerLevel;
        this.SelectedShop = { Id: null, Name: null };
        this.Shops = [];
    }

    load(data) {
        if (data === null ||
            !REQUIRED_KEYS.every(key => data.hasOwnProperty(key))) {
            return null;
        }

        this.Id = data.Id;
        this.Name = data.Name;
        this.Level = data.Level;
        this.PlayerLevel = data.PlayerLevel;
        this.SelectedShop = data.SelectedShop;
        this.Shops = data.Shops;

        return this;
    }

    addShop(id, name) {
        if (this.shopIdExist(id) || this.shopNameExist(name)) {
            return;
        }

        this.Shops.push({ Id: id, Name: name });
        this.SelectedShop = { Id: id, Name: name };
    }

    shopNameExist(name) {
        return this.Shops.some(shop => shop.Name === name);
    }

    shopIdExist(id) {
        return this.Shops.some(shop => shop.Id === id);
    }

    getShopName(id) {
        return this.Shops.find(shop => shop.Id === id)?.Name;
    }

    getShopId(name) {
        return this.Shops.find(shop => shop.Name === name)?.Id;
    }

    selectShop(value) {
        let shop = this.Shops.find(shop => shop.Name === value);
        if (!shop) {
            shop = this.Shops.find(shop => shop.Id === value);
        }
        this.SelectedShop = { Id: shop?.Id, Name: shop?.Name };
    }

    deleteShop(value) {
        this.Shops = this.Shops.filter(shop => shop.Id !== value && shop.Name !== value);
    }

    setPlayerLevel(lv) {
        this.PlayerLevel = Math.max(1, Math.min(99, parseInt(lv)));

        this.Shops.forEach(shop => {
            var shopDb = db.getShop(shop.Id);
            shopDb.setPlayerLevel(lv);
            db.setShop(shopDb);
        });
    }

    setCityLevel(lv) {
        this.Level = Math.max(0, Math.min(5, lv));

        this.Shops.forEach(shop => {
            var shopDb = db.getShop(shop.Id);
            shopDb.setCityLevel(lv);
            db.setShop(shopDb);
        });
    }

}

export default City;
