import items from '../app_data/items.json';
import scrolls from '../app_data/scrolls.json';
import tables from '../app_data/tables.json';

export const itemTypes = [
    'Ammo',
    'Armor',
    'Good',
    'Magic Armor',
    'Magic Weapon',
    'Potion',
    'Ring',
    'Rod',
    'Scroll',
    'Shield',
    'Staff',
    'Wand',
    'Weapon',
    'Wondrous Item'
];

export function loadFile(fileName) {
    try {
        switch (fileName) {
            case 'items':
                return items;
            case 'scrolls':
                return scrolls;
            case 'tables':
                return tables;
            default:
                return null
        }
    } catch (error) {
        return null;
    }
}

export function weightedRandom(weights) {
    const totalWeight = weights.reduce((acc, val) => acc + val, 0);
    const randomNum = Math.random() * totalWeight;
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (randomNum <= sum) {
            return i;
        }
    }
}

export function cap(string) {
    if (typeof string !== 'string' || string.length === 0)
        return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function shopTypes() {
    const tables = loadFile('tables');
    return tables['Shop Types'].map(item => item.Name);
}

export function isMobile() {
    const isMobile = (window.innerWidth <= 760);
    return isMobile
}

export function trimLine(string, endLine = 11) {
    if (string) {
        const dot = string.length > endLine ? '…' : '';
        return `${string.slice(0, endLine)}${dot}`;
    }
    return string;
}

export function order(list, element) {
    if (list != null && list.length > 0) {
        list = list.filter(item => item !== element);
        list.sort();
        return [element].concat(list);
    }
    return [];
}

export function newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : ((r & 0x3) | 0x8);
        return v.toString(16);
    });
}

export function serialize(obj) {
    return obj && typeof obj.serialize === 'function'
        ? obj.serialize()
        : obj;
}
