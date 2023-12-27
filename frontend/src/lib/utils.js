import items from '../appData/items.json';
import scrolls from '../appData/scrolls.json';
import tables from '../appData/tables.json';

export const itemTypes = [
    "Good",
    "Ammo",
    "Weapon",
    "Armor",
    "Shield",
    "Magic Weapon",
    "Magic Armor",
    "Potion",
    "Ring",
    "Rod",
    "Staff",
    "Wand",
    "Wondrous Item",
    "Scroll"
  ];

export function loadFile(fileName) {
    try {
        switch(fileName) {
            case "items":
                return items;
            case "scrolls":
                return scrolls;
            case "tables":
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
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function shopNames() {
    const tables = loadFile("tables");
    return tables["Shop Types"].map(item => item.Name);
}

export function isMobile() {
    const isMobile = (window.innerWidth <= 760);
    return isMobile
}

export function trimLine(string, endLine = 11) {
    if (string){
        const dot = string.length > endLine ? "…" : "";
        return `${string.slice(0, endLine)}${dot}`;
    }
    return string;
}
