import { loadFile, newGuid } from './utils';

const REQUIRED_KEYS = ['Id', 'Name', 'Class', 'Level', 'Characteristic', 'Spells'];
export const CLASSES = ["Sorcerer", "Wizard", "Cleric", "Druid", "Bard", "Ranger", "Paladin"];
const CLASSCHARMAP = {
    "Sorcerer": 'Charisma',
    "Wizard": 'Intelligence',
    "Cleric": 'Wisdom',
    "Druid": 'Wisdom',
    "Bard": 'Charisma',
    "Ranger": 'Wisdom',
    "Paladin": 'Wisdom'
};
export const MAGICSCHOOLS = [
    "Abjuration",
    "Conjuration",
    "Divination",
    "Enchantment",
    "Evocation",
    "Illusion",
    "Necromancy",
    "Transmutation"
];

class Spellbook {

    constructor(name = '') {
        this.Id = newGuid();
        this.Name = name;
        this.Class = "";
        this.Level = 1;
        this.Characteristic = 10;
        this.Spells = [];
    }

    load(data) {
        if (typeof data !== 'object' || data === null ||
            !REQUIRED_KEYS.every(key => data.hasOwnProperty(key))) {
            return this;
        }

        this.Id = data.Id;
        this.Name = data.Name;
        this.Class = data.Class;
        this.Level = data.Level;
        this.Characteristic = data.Characteristic;
        this.Spells = data.Spells;

        return this;
    }

    setClass(_class) {
        if (CLASSES.includes(_class))
            this.Class = _class;
    }

    setLevel(level) {
        if (level > 0)
            this.Level = level;
    }

    setCharacteristic(char) {
        if (char > 0)
            this.Characteristic = char;
    }

    addSpell(spell_link) {
        const existing = this.Spells.find(s => s.Link === spell_link);
        if (existing) {
            existing.Known += 1;
        } else {
            this.Spells.push({
                Link: spell_link,
                Known: 1,
                Prepared: 0
            });
        }
    }

    removeSpell(spell_link) {
        const existing = this.Spells.find(s => s.Link === spell_link);
        if (existing) {
            existing.Known -= 1;
            if (existing.Known <= 0) {
                this.Spells = this.Spells.filter(s => s.Link !== spell_link);
            }
        }
    }

    prepareSpell(spell_link) {
        const spell = this.Spells.find(s => s.Link === spell_link);
        if (spell) {
            spell.Prepared += 1;
        }
    }

    unprepareSpell(spell_link) {
        const spell = this.Spells.find(s => s.Link === spell_link);
        if (spell) {
            spell.Prepared = Math.max(0, spell.Prepared - 1);
        }
    }

    getCharBonus() {
        return Math.floor((this.Characteristic - 10) / 2);
    }

    getCharName() {
        return CLASSCHARMAP[this.Class];
    }

    getDifficultyClass(spell_level) {
        return 10 + this.getCharBonus() + spell_level;
    }

    getClassDescription() {
        return loadFile("tables")["Class description"][this.Class] ?? "";
    }

    getSpellsPerDay() {
        const spells_per_day_tables = loadFile("tables")["Spell slot"]
        const wizardSpellsPerDay = spells_per_day_tables["Wizard per day"];
        const bardSpellsPerDay = spells_per_day_tables["Bard per day"];
        const clericSpellsPerDay = spells_per_day_tables["Cleric per day"]; // same as druid
        const paladinSpellsPerDay = spells_per_day_tables["Paladin per day"]; // same as ranger
        const sorcererSpellsPerDay = spells_per_day_tables["Sorcerer per day"];

        const _bonusSpells = spells_per_day_tables["Bonus spells"];

        if (!this.Class) {
            return [0]
        }

        const _baseSpellsPerDay = {
            "Sorcerer": sorcererSpellsPerDay,
            "Wizard": wizardSpellsPerDay,
            "Cleric": clericSpellsPerDay,
            "Druid": clericSpellsPerDay,
            "Bard": bardSpellsPerDay,
            "Ranger": paladinSpellsPerDay,
            "Paladin": paladinSpellsPerDay
        }[this.Class];

        const lvl = Math.min(Math.max(this.Level, 1), 20);
        let base = _baseSpellsPerDay[lvl - 1];

        const mod = this.getCharBonus();

        if (mod < 0) {
            return new Array(10).fill(0);
        }

        let bonus = _bonusSpells[mod] || _bonusSpells[17];

        if (this.Class === "Ranger" || this.Class === "Paladin")
            base = [0].concat(base);

        bonus = bonus.map((v, i) => base[i] < 0 ? 0 : v);

        let spellNumberArray = base.map((v, i) => v < 0 ? 0 : v);
        spellNumberArray = spellNumberArray.map((slots, i) => slots + bonus[i])
        return spellNumberArray.map((v, i) => i >= this.Characteristic - 9 ? 0 : v);
    }

    maxSpellLevel() {
        const arr = this.getSpellsPerDay();
        for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i] !== 0) {
                return i;
            }
        }
        return -1;
    }

    getAllSpells({ name, school, level } = {}) {
        const spells = loadFile('spells');
        return this._getSpells(spells, { name, school, level });
    }

    getLearnedSpells({ name, school, level } = {}) {
        const all_spells = loadFile("spells");
        const spells = this.Spells.map(x => all_spells.find(y => y.Link === x));
        return this._getSpells(spells, { name, school, level });
    }

    _getSpells(spells, { name, school, level } = {}) {
        const classKeyMap = {
            "Sorcerer": 'Sor/Wiz',
            "Wizard": 'Sor/Wiz',
            "Cleric": 'Clr',
            "Druid": 'Drd',
            "Bard": 'Brd',
            "Ranger": 'Rgr',
            "Paladin": 'Pal'
        };
        const key = classKeyMap[this.Class];

        return spells.filter(spell => {
            if (!spell) return false;
            const parts = spell.Level.split(',').map(s => s.trim());
            const entry = parts.find(p => p.startsWith(key + ' '));
            if (!entry) return false;
            if (name && !spell.Name.toLowerCase().includes(name.toLowerCase())) {
                return false;
            }
            if (school && !spell.School.toLowerCase().includes(school.toLowerCase())) {
                return false;
            }
            if (typeof level === 'number') {
                const lvlNum = parseInt(entry.slice(key.length).trim(), 10);
                if (lvlNum !== level) return false;
            }
            else {
                const lvlNum = parseInt(entry.slice(key.length).trim(), 10);
                if (lvlNum > this.maxSpellLevel()) return false;
            }
            return true;
        });
    }

    serialize() {
        return {
            Id: this.Id,
            Name: this.Name,
            Class: this.Class,
            Level: this.Level,
            Characteristic: this.Characteristic,
            Spells: this.Spells
        };
    }
}

export default Spellbook;
