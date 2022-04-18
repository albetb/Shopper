from random import choices, randint
from json import load
from secrets import choice

class Item():
    def __init__(self) -> None:
        self.items = self.load_items()
        self.scrolls = self.load_items("scrolls")

    def load_items(self, file = "items") -> dict:
        """ Load items or scrolls list """
        with open(f"{file}.json", "r") as file:
            return load(file)

    def new(self, type: str, shop_level: float, party_level: int) -> dict or None:
        """ Generate a new item of the selected type """
        quality = self.quality(shop_level, party_level)
        generate = {
            "Good" : self.new_good(shop_level),
            "Ammo" : self.new_ammo(),
            "Weapon" : self.new_weapon(shop_level),
            "Armor" : self.new_armor(shop_level),
            "Shield" : self.new_shield(shop_level),
            "Magic Weapon": self.new_magic_weapon(shop_level, quality),
            "Magic Armor": self.new_magic_armor(shop_level, quality),
            "Potion" : self.new_potion(shop_level, quality),
            "Ring" : self.new_ring(shop_level, quality),
            "Rod" : self.new_rod(shop_level, quality), # None if quality is "Minor"
            "Staff" : self.new_staff(shop_level, quality), # None if quality is "Minor"
            "Wand" : self.new_wand(shop_level, quality),
            "Wondrous Item" : self.new_wondrous_item(shop_level, quality),
            "Scroll" : self.new_scroll(shop_level, quality)
        }
        return generate[type]

    def quality(self, shop_level: float, party_level: int) -> str:
        """ Generate a random quality for an item based on party level """
        major = min(0 if party_level < 10 else 1 if party_level == 10 else 5 * (party_level - 10) + shop_level ** 0.5, 100)
        medium = min(0 if party_level < 5 else 1 if party_level == 5 else 5 * (party_level - 5) + shop_level ** 0.75, 100 - major)
        minor = max(0, 100 - medium - major)
        return choices(population = ("Minor", "Medium", "Major"), weights = (minor, medium, major))[0]

    def new_good(self, shop_level: float) -> dict:
        """ Generate a new non magical Good """
        max_cost = max((item["Cost"] for item in self.items["Good"]))
        weights = (int((max_cost - item["Cost"]) / 10 + shop_level ** 2) for item in self.items["Good"])
        return choices(population = self.items["Good"], weights = weights)[0]

    def new_ammo(self) -> dict:
        """ Generate a new Ammo for ranged weapons """
        return choices(population = self.items["Ammo"],
                       weights = (item["Chance"] for item in self.items["Ammo"]))[0]

    def new_weapon(self, shop_level: float) -> dict:
        """ Generate a new non magical Weapon """
        return choices(population = self.items["Weapon"],
                       weights = (item["Chance"] + shop_level for item in self.items["Weapon"]))[0]

    def new_armor(self, shop_level: float) -> dict:
        """ Generate a new non magical Armor """
        return choices(population = self.items["Armor"],
                       weights = (item["Chance"] + shop_level ** 0.5 for item in self.items["Armor"]))[0]

    def new_shield(self, shop_level: float) -> dict:
        """ Generate a new non magical Shield """
        return choices(population = self.items["Shield"],
                       weights = (item["Chance"] + shop_level ** 0.5 for item in self.items["Shield"]))[0]

    def new_potion(self, shop_level: float, quality: str) -> dict:
        """ Generate a new Potion """
        weights = (item[quality] + shop_level * int(item[quality] > 0) for item in self.items["Potion"])
        return choices(population = self.items["Potion"], weights = weights)[0]

    def new_ring(self, shop_level: float, quality: str) -> dict:
        """ Generate a new Ring """
        weights = (item[quality] + shop_level * int(item[quality] > 0) for item in self.items["Ring"])
        return choices(population = self.items["Ring"], weights = weights)[0]

    def new_rod(self, shop_level: float, quality: str) -> dict or None:
        """ Generate a new Rod, is None if quality is "Minor" """
        if quality == "Minor": return None
        weights = (item[quality] + shop_level * int(item[quality] > 0) for item in self.items["Rod"])
        return choices(population = self.items["Rod"], weights = weights)[0]

    def new_staff(self, shop_level: float, quality: str) -> dict or None:
        """ Generate a new Staff, is None if quality is "Minor" """
        if quality == "Minor": return None
        weights = (item[quality] + shop_level * int(item[quality] > 0) for item in self.items["Staff"])
        return choices(population = self.items["Staff"], weights = weights)[0]

    def new_wand(self, shop_level: float, quality: str) -> dict:
        """ Generate a new Wand """
        weights = (item[quality] + shop_level * int(item[quality] > 0) for item in self.items["Wand"])
        return choices(population = self.items["Wand"], weights = weights)[0]

    def new_wondrous_item(self, shop_level: float, quality: str) -> dict:
        """ Generate a new Wondrous Item """
        id = int(min(randint(0, 2 * shop_level) + randint(1, 100), 100))
        items = self.items["Wondrous Item"]
        return list(filter(lambda x: x["Id"] == id and x["Type"] == quality, items))[0]

    def new_scroll(self, shop_level: float, quality: str) -> dict:
        """ Generate a new Scroll, 70% Arcane 30% Divine """
        scroll_type = choices(population = ("Arcane", "Divine"), weights = (7, 3))[0]
        l_weights = (item[quality] + (shop_level ** 0.5) * int(item[quality] > 0) for item in self.scrolls["Scroll level"])
        level = choices(population = self.scrolls["Scroll level"], weights = l_weights)[0]["Level"]
        scrolls = list(filter(lambda x: x["Level"] == level, self.scrolls[scroll_type]))
        s_weights = (item["Chance"] for item in scrolls)
        return choices(population = scrolls, weights = s_weights)[0]

    def new_magic_weapon(self, shop_level: float, quality: str) -> dict:
        """ Generate a new Magic Weapon """
        # Chance to get a specific Magic Weapon
        specific_weapon_chance = {
            "Minor": 5,
            "Medium": 6,
            "Major": 14
        }
        is_specific_weapon = randint(1, 100) <= specific_weapon_chance[quality]
        if is_specific_weapon:
            weights = (item[quality] for item in self.items["Specific Weapon"])
            return choices(population = self.items["Specific Weapon"], weights = weights)[0]

        # Get random normal weapon
        weapon = dict(self.new_weapon(shop_level))

        # Get random base bonus for the weapon
        weights = (item[quality] + (shop_level ** 0.5) * int(item[quality] > 0) for item in self.items["Magic Weapon Base"])
        base_bonus = choices(population = self.items["Magic Weapon Base"],
                             weights = weights)[0]["Name"]
        bonus = int(base_bonus)

        # Chance to get a special ability on the weapon
        special_ability_chance = {
            "Minor": 10,
            "Medium": 32,
            "Major": 37
        }
        has_special_ability = randint(1, 100) <= special_ability_chance[quality] + max(shop_level ** 0.5 - 1, 0)

        if has_special_ability:
            # Save weapon type
            weapon_type = "Magic Ranged Weapon" if "Ranged" in weapon["Subtype"] else "Magic Melee Weapon"

            ability_list = []
            rolls = 1
            while rolls > 0:
                rolls -= 1

                # Chance to get double special ability on the weapon
                double_ability_chance = {
                    "Minor": 1,
                    "Medium": 5,
                    "Major": 10
                }
                has_double_ability = randint(1, 100) <= double_ability_chance[quality]

                # If has double ability reroll two times
                if has_double_ability:
                    rolls += 2
                    continue

                # Roll special ability
                special_ability = choices(population = self.items[weapon_type],
                                          weights = (item[quality] for item in self.items[weapon_type]))[0]

                # Reroll if ability is already added
                if special_ability["Name"] in (item["Name"] for item in ability_list):
                    rolls += 1
                    continue

                if isinstance(special_ability["Cost Modifier"], int) and special_ability["Cost Modifier"] < 6:
                    # Reroll if special ability bonus + base bonus exceed 10
                    if bonus + special_ability["Cost Modifier"] > 10:
                        rolls += 1
                        continue
                    # Add ability modifier to total weapon bonus
                    bonus += special_ability["Cost Modifier"]

                # Weapon name is something like "Shortbow, Flaming +2"
                weapon["Name"] += f", {special_ability['Name']}"

                ability_list.append(special_ability)

                # If bonus is 10 no more abilities can be added to the weapon
                if bonus >= 10: break

            # Add ability list to the weapon if it's not empty
            weapon["Ability"] = ability_list

        # Add base modifier on the weapon
        weapon["Bonus"] = base_bonus
        weapon["Name"] = f"{weapon['Name']} +{base_bonus}"

        # Weapon cost is base cost + 300 for masterwork + 2000 * total bonus ** 2
        weapon["Cost"] += 300 + 2000 * bonus ** 2

        return weapon

    def new_magic_armor(self, shop_level: float, quality: str) -> dict:
        """ Generate a new Magic Armor or Shield """
        # Chance to get a specific Magic Weapon
        specific_weapon_chance = {
            "Minor": 4,
            "Medium": 6,
            "Major": 6
        }
        is_specific_weapon = randint(1, 100) <= specific_weapon_chance[quality]

        if is_specific_weapon:
            weapon_type = choice(("Armor", "Shield"))
            weights = (item[quality] + (shop_level ** 0.5) * int(item[quality] > 0) for item in self.items[f"Specific {weapon_type}"])
            return choices(population = self.items[f"Specific {weapon_type}"], weights = weights)[0]

        # Get random base bonus for the item and determine if it's an armor or a shield
        weights = (item[quality] + (shop_level ** 0.5) * int(item[quality] > 0) for item in self.items["Magic Armor Base"])
        bonus_name = choices(population = self.items["Magic Armor Base"],
                             weights = weights)[0]["Name"]
        base_bonus = int(bonus_name[1])
        bonus = int(base_bonus)
        is_armor = "armor" in bonus_name

        # Get random normal armor or shield
        armor = dict(self.new_armor(shop_level)) if is_armor else dict(self.new_shield(shop_level))

        # Chance to get a special ability on the item
        special_ability_chance = {
            "Minor": 9,
            "Medium": 37,
            "Major": 37
        }
        has_special_ability = randint(1, 100) <= special_ability_chance[quality] + max(shop_level ** 0.5 - 1, 0)

        if has_special_ability:
            # Save item type
            item_type = "Magic Armor" if is_armor else "Magic Shield"

            ability_list = []
            rolls = 1
            while rolls > 0:
                rolls -= 1

                # Chance to get double special ability on the item
                double_ability_chance = {
                    "Minor": 1,
                    "Medium": 5,
                    "Major": 10
                }
                has_double_ability = randint(1, 100) <= double_ability_chance[quality]

                # If has double ability reroll two times
                if has_double_ability:
                    rolls += 2
                    continue

                # Roll special ability
                special_ability = choices(population = self.items[item_type],
                                          weights = (item[quality] for item in self.items[item_type]))[0]

                # Reroll if ability is already added
                if special_ability["Name"] in (item["Name"] for item in ability_list):
                    rolls += 1
                    continue

                if isinstance(special_ability["Cost Modifier"], int):
                    if special_ability["Cost Modifier"] < 6:
                        # Reroll if special ability bonus + base bonus exceed 10
                        if bonus + special_ability["Cost Modifier"] > 10:
                            rolls += 1
                            continue
                        # Add ability modifier to total item bonus
                        bonus += special_ability["Cost Modifier"]
                    else:
                        # If cost modifier is > 5 is a flat modifier
                        armor["Cost"] += special_ability["Cost Modifier"]

                # Item name is something like "Chainmail, Shadow +2"
                armor["Name"] += f", {special_ability['Name']}"

                ability_list.append(special_ability)

                # If bonus is 10 no more abilities can be added to the item
                if bonus >= 10: break

            # Add ability list to the item if it's not empty
            armor["Ability"] = ability_list

        # Add base modifier on the item
        armor["Bonus"] = base_bonus
        armor["Name"] = f"{armor['Name']} +{base_bonus}"

        # Item cost is base cost + 300 for masterwork + 2000 * total bonus ** 2
        armor["Cost"] += 300 + 2000 * bonus ** 2

        return armor
