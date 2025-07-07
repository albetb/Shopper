import items from '../data/items.json';
import scrolls from '../data/scrolls.json';
import tables from '../data/tables.json';
import spells from '../data/spells.json';

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
        switch (fileName.toLowerCase()) {
            case 'items':
                return items;
            case 'scrolls':
                return scrolls;
            case 'tables':
                return tables;
            case 'spells':
                return spells;
            default:
                return null
        }
    } catch (error) {
        return null;
    }
}

export function getSpellByLink(link) {
    try {
        const spells = loadFile('spells');
        const spell = spells.find(s => s.Link === link);
        return spell ? [spell] : [];
    } catch (err) {
        return [];
    }
}

export function getItemByLink(link, bonus = 0) {
  try {
    const items = loadFile('items');
    const types = [
      "Good", "Ammo", "Weapon", "Specific Weapon", "Armor",
      "Specific Armor", "Shield", "Specific Shield", "Potion",
      "Ring", "Rod", "Staff", "Wand", "Wondrous Item"
    ];
    const allItems = types.flatMap(type => items[type] || []);
    const found = allItems.find(item => item.Link === link);
    if (!found) return [];

    // strip out unused props
    const { Minor, Medium, Major, Chance, Id, Type, Cost, ...card } = found;

    // unit‑suffix normalization
    if (typeof card.Weight === 'number') card.Weight = card.Weight + ' kg';
    if (typeof card.Range === 'number') card.Range  = card.Range === 0 ? '—' : card.Range + ' ft.';

    if (bonus === -1) {
      // perfect
      if (card["Armor Check Penalty"]) {
        card["Armor Check Penalty"] += ' (+1)';
      }
      card.Name += ', perfect';
      if ((card["Dmg (S)"] || card["Dmg (M)"]) && !card["Armor/Shield Bonus"]) {
        const desc = card.Description ? card.Description : "";
        card.Description = "<p><i>+1 to attack rolls when used in combat.</i></p>" + desc;
      }
    } else if (bonus > 0) {
      // +bonus
      if (card["Dmg (S)"] && !card["Armor/Shield Bonus"]) {
        card["Dmg (S)"] += ` (+${bonus})`;
      }
      if (card["Dmg (M)"] && !card["Armor/Shield Bonus"]) {
        card["Dmg (M)"] += ` (+${bonus})`;
      }
      if (card["Armor/Shield Bonus"]) {
        card["Armor/Shield Bonus"] += ` (+${bonus})`;
      }
      if (card["Armor Check Penalty"] && parseInt(card["Armor Check Penalty"], 10) < 0) {
        card["Armor Check Penalty"] += ' (+1)';
      }
      if (card["Dmg (S)"] || card["Dmg (M)"] || card["Armor/Shield Bonus"]) {
        card.Name += ` +${bonus}`;
      }
      if ((card["Dmg (S)"] || card["Dmg (M)"]) && !card["Armor/Shield Bonus"]) {
        const desc = card.Description ? card.Description : "";
        card.Description = `<p><i>+${bonus} to attack rolls when used in combat.</i></p>` + desc;
      }
    }

    return [card];
  } catch (err) {
    return [];
  }
}

export function getEffectByLink(link) {
    try {
        const types = ["Magic Melee Weapon", "Magic Ranged Weapon", "Magic Shield", "Magic Armor"];

        const effectsRaw = loadFile('tables');
        const effects = types.flatMap(type => effectsRaw[type] || []);

        const found = effects.find(item => item.Link === link);
        if (!found) return [];

        const { Minor, Medium, Major, "Cost Modifier": costModifier, ...cleaned } = found;

        return cleaned;
    } catch (err) {
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
