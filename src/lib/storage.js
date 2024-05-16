import World from './world';
import City from './city';
import Shop from './shop';

//#region get

export function getWorlds() {
    return JSON.parse(localStorage.getItem('Worlds')) || [];
}

export function getSelectedWorld() {
    return JSON.parse(localStorage.getItem('SelectedWorld')) || { Id: null, Name: null };
}

export function getWorld(id) {
    return new World().load(JSON.parse(localStorage.getItem(`World/${id}`)));
}

export function getCity(id) {
    return new City().load(JSON.parse(localStorage.getItem(`City/${id}`)));
}

export function getShop(id) {
    return new Shop().load(JSON.parse(localStorage.getItem(`Shop/${id}`)));
}

//#endregion

//#region set

export function setWorlds(value) {
    localStorage.setItem('Worlds', JSON.stringify(value));
}

export function setSelectedWorld(value) {
    localStorage.setItem('SelectedWorld', JSON.stringify(value));
}

export function setWorld(value) {
    localStorage.setItem(`World/${value.Id}`, JSON.stringify(value));
}

export function setCity(value) {
    localStorage.setItem(`City/${value.Id}`, JSON.stringify(value));
}

export function setShop(value) {
    localStorage.setItem(`Shop/${value.Id}`, JSON.stringify(value));
}

//#endregion
