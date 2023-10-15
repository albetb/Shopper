import items from '../appData/items.json';
import scrolls from '../appData/scrolls.json';
import shops from '../appData/shops.json';
import tables from '../appData/tables.json';

function loadFile(fileName) {
    try {
        switch(fileName) {
            case "items":
                return items;
            case "scrolls":
                return scrolls;
            case "shops":
                return shops;
            case "tables":
                return tables;
            default:
                return null
          }
    } catch (error) {
        return null;
    }
}

function weightedRandom(weights) {
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

function cap(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function shopNames(all = false) {
    const shopTypes = loadFile("shops");
    return shopTypes.Type.filter(item => (item.Name !== "Jeff" || all)).map(item => item.Name);
}

export { loadFile, weightedRandom, cap, shopNames };