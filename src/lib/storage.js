import { cap } from './utils';
import Shop from './shop';

//#region get

export function getWorlds() {
    return JSON.parse(localStorage.getItem('worlds')) || [];
}

export function getPlayerLevel(world) {
    return localStorage.getItem(`${world}_level`) || 1;
}

export function getCities(world) {
    return JSON.parse(localStorage.getItem(`cities_${world}`)) || [];
}

export function getCityLevel(world, city) {
    return localStorage.getItem(`${world}_${city}_level`) || 1;
}

export function getShops(world, city) {
    return JSON.parse(localStorage.getItem(`shops_${world}_${city}`)) || [];
}

export function getShop(world, city, shop) {
    const shopJson = JSON.parse(localStorage.getItem(`${world}_${city}_${shop}_shop`));
    if (shopJson) {
        let shop = new Shop();
        var isValid = shop.deserialize(shopJson);
        if (isValid) {
            return shop;
        }
    }
    return null;
}

//#endregion

//#region set

export function setWorlds(value) {
    localStorage.setItem('worlds', JSON.stringify(value));
}

export function setPlayerLevel(world, value) {
    localStorage.setItem(`${cap(world)}_level`, value);
}

export function setCities(world, value) {
    localStorage.setItem(`cities_${cap(world)}`, JSON.stringify(value));
}

export function setCityLevel(world, city, value) {
    localStorage.setItem(`${cap(world)}_${cap(city)}_level`, value);
}

export function setShops(world, city, value) {
    localStorage.setItem(`shops_${cap(world)}_${cap(city)}`, JSON.stringify(value))
}

export function setShop(world, city, shop, value) {
    localStorage.setItem(`${world}_${city}_${shop}_shop`, JSON.stringify(value));
}

//#endregion
