import { cap } from './utils';

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

export function getShopLevel(world, city, shop) {
    return localStorage.getItem(`${world}_${city}_${shop}_level`) || 0;
}

export function getReputation(world, city, shop) {
    return localStorage.getItem(`${world}_${city}_${shop}_reputation`) || 0;
}

export function getShopType(world, city, shop) {
    return localStorage.getItem(`${world}_${city}_${shop}_type`) || '';
}

export function getInventory(world, city, shop) {
    return JSON.parse(localStorage.getItem(`${world}_${city}_${shop}_stock`)) || [];
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

export function setShopLevel(world, city, shop, value) {
    localStorage.setItem(`${cap(world)}_${cap(city)}_${cap(shop)}_level`, value);
}

export function setReputation(world, city, shop, value) {
    localStorage.setItem(`${cap(world)}_${cap(city)}_${cap(shop)}_reputation`, value);
}

export function setShopType(world, city, shop, value) {
    localStorage.setItem(`${cap(world)}_${cap(city)}_${cap(shop)}_type`, value);
}

export function setStock(world, city, shop, value) {
    localStorage.setItem(`${world}_${city}_${shop}_stock`, JSON.stringify(value));
}

//#endregion
