from asyncio import shield
from random import choices, randint, random
from json import load
from secrets import choice

class Item():
    def __init__(self) -> None:
        self.items = self.load_items()
        self.scrolls = self.load_items("scrolls")
        self.tables = self.load_items("tables")

    def load_items(self, file: str = "items") -> dict:
        """ Load items or scrolls list """
        with open(f"config/{file}.json", "r") as file:
            return load(file)

    def new(self, item_type: str, 
                  shop_level: float, 
                  party_level: int, 
                  quality: str or None = None, 
                  arcane_chance: float = 0.7) -> dict or None:
        """ Generate a new item of the selected type """
        quality = self.quality(shop_level, party_level) if quality == None else quality
        return {
            "Good": lambda: self.new_good(shop_level),
            "Ammo": lambda: self.new_ammo(),
            "Weapon": lambda: self.new_weapon(shop_level, party_level),
            "Armor": lambda: self.new_armor(shop_level, party_level),
            "Shield": lambda: self.new_shield(shop_level, party_level),
            "Magic Weapon": lambda: self.new_magic_weapon(shop_level, quality),
            "Magic Armor": lambda: self.new_magic_armor(shop_level, quality),
            "Potion": lambda: self.new_potion(shop_level, quality),
            "Ring": lambda: self.new_ring(shop_level, quality),
            "Rod": lambda: self.new_rod(shop_level, quality), # None if quality is "Minor"
            "Staff": lambda: self.new_staff(shop_level, quality), # None if quality is "Minor"
            "Wand": lambda: self.new_wand(shop_level, quality),
            "Wondrous Item": lambda: self.new_wondrous_item(shop_level, quality),
            "Scroll": lambda: self.new_scroll(shop_level, quality, arcane_chance)
        }[item_type]()

    def random_magic_item(self, shop_level: float, party_level: int) -> dict:
        quality = self.quality(shop_level, party_level)
        item_type = self.item_choice("Random Magic Item Chance", quality = quality, file = "tables")["Name"]
        return self.new(item_type, shop_level, party_level, quality)

    def quality(self, shop_level: float, party_level: int) -> str:
        """ Generate a random quality for an item based on party level """
        major = min(0 if party_level < 10 else 1 if party_level == 10 else 5 * (party_level - 10) + shop_level ** 0.5, 100)
        medium = min(0 if party_level < 5 else 1 if party_level == 5 else 5 * (party_level - 5) + shop_level ** 0.75, 100 - major)
        minor = max(0, 100 - medium - major)
        return choices(population = ("Minor", "Medium", "Major"), weights = (minor, medium, major))[0]

    def item_choice(self, name: str, quality: str = "Chance", mod: float = 0, file: str = "items") -> dict:
        """ Choose an item from a list of dict based on an attribute """
        # Select correct file
        table = self.tables[name] if file == "tables" else self.scrolls[name] if file == "scrolls" else self.items[name]

        weights = (item[quality] + mod * int(item[quality] > 0) for item in table)
        item = dict(choices(population = table, weights = weights)[0])
        return self.remove_unused_attributes(item)

    def remove_unused_attributes(self, item: dict) -> dict:
        """ Remove some attributes from the item used for item generation """
        clean_item = dict(item)
        for key in ["Minor", "Medium", "Major", "Chance", "Id"]:
            if key in item.keys():
                del clean_item[key]
        return clean_item

    def new_good(self, shop_level: float) -> dict:
        """ Generate a new non magical Good """
        return self.item_choice("Good")

    def new_ammo(self) -> dict:
        """ Generate a new Ammo for ranged weapons """
        return self.item_choice("Ammo")

    def new_weapon(self, shop_level: float, party_level: int) -> dict:
        """ Generate a new non magical Weapon """
        weapon = self.item_choice("Weapon", mod = shop_level)
        perfect_chance = min((shop_level + party_level ** 0.5) / 10, 1)
        if random() < perfect_chance:
            weapon["Name"] += ", perfect"
            weapon["Cost"] += 300
        return weapon

    def new_armor(self, shop_level: float, party_level: int) -> dict:
        """ Generate a new non magical Armor """
        armor = self.item_choice("Armor", mod = shop_level ** 0.5)
        perfect_chance = min((shop_level + party_level ** 0.5) / 10, 1)
        if random() < perfect_chance:
            armor["Name"] += ", perfect"
            armor["Cost"] += 300
        return armor

    def new_shield(self, shop_level: float, party_level: int) -> dict:
        """ Generate a new non magical Shield """
        shield = self.item_choice("Shield", mod = shop_level ** 0.5)
        perfect_chance = min((shop_level + party_level ** 0.5) / 10, 1)
        if random() < perfect_chance:
            shield["Name"] += ", perfect"
            shield["Cost"] += 300
        return shield

    def new_potion(self, shop_level: float, quality: str) -> dict:
        """ Generate a new Potion """
        return self.item_choice("Potion", quality = quality, mod = shop_level)

    def new_ring(self, shop_level: float, quality: str) -> dict:
        """ Generate a new Ring """
        return self.item_choice("Ring", quality = quality, mod = shop_level)

    def new_rod(self, shop_level: float, quality: str) -> dict or None:
        """ Generate a new Rod, is None if quality is "Minor" """
        if quality == "Minor": return None
        return self.item_choice("Rod", quality = quality, mod = shop_level)

    def new_staff(self, shop_level: float, quality: str) -> dict or None:
        """ Generate a new Staff, is None if quality is "Minor" """
        if quality == "Minor": return None
        return self.item_choice("Staff", quality = quality, mod = shop_level)

    def new_wand(self, shop_level: float, quality: str) -> dict:
        """ Generate a new Wand """
        return self.item_choice("Wand", quality = quality, mod = shop_level)

    def new_wondrous_item(self, shop_level: float, quality: str) -> dict:
        """ Generate a new Wondrous Item """
        id = int(min(randint(0, int(1.5 * shop_level)) + randint(1, 100), 100))
        items = self.items["Wondrous Item"]
        item = dict(list(filter(lambda x: x["Id"] == id and x["Type"] == quality, items))[0])
        return self.remove_unused_attributes(item)

    def new_scroll(self, shop_level: float, quality: str, arcane_chance: float = 0.7) -> dict:
        """ Generate a new Scroll, 70% Arcane 30% Divine """
        arcane_chance = max(min(arcane_chance, 1), 0)
        divine_chance = max(min(1 - arcane_chance, 1), 0)
        scroll_type = choices(population = ("Arcane", "Divine"), weights = (arcane_chance, divine_chance))[0]
        level = self.item_choice("Scroll Level", quality = quality, mod = shop_level ** 0.5, file = "tables")["Level"]
        scrolls = list(filter(lambda x: x["Level"] == level, self.scrolls[scroll_type]))
        s_weights = (item["Chance"] for item in scrolls)
        return self.remove_unused_attributes(choices(population = scrolls, weights = s_weights)[0])

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
            return self.item_choice("Specific Weapon", quality = quality, file = "tables")

        # Get random normal weapon
        weapon = dict(self.item_choice("Weapon", mod = shop_level))

        # Get random base bonus for the weapon
        base_bonus = self.item_choice("Magic Weapon Base", quality = quality, mod = shop_level ** 0.5, file = "tables")["Name"]
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
                special_ability = self.item_choice(weapon_type, quality = quality, file = "tables")

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
        # Chance to get a specific Magic Armor or Shield
        specific_item_chance = {
            "Minor": 4,
            "Medium": 6,
            "Major": 6
        }
        is_specific_item = randint(1, 100) <= specific_item_chance[quality]

        if is_specific_item:
            item_type = choice(("Armor", "Shield"))
            return self.item_choice(f"Specific {item_type}", quality = quality, mod = shop_level ** 0.5, file = "tables")

        # Get random base bonus for the item and determine if it's an armor or a shield
        bonus_name = self.item_choice("Magic Armor Base", quality = quality, mod = shop_level ** 0.5, file = "tables")["Name"]
        base_bonus = int(bonus_name[1])
        bonus = int(base_bonus)
        is_armor = "armor" in bonus_name

        # Get random normal armor or shield
        armor = dict(self.item_choice("Armor", mod = shop_level ** 0.5)) if is_armor else dict(self.item_choice("Shield", mod = shop_level ** 0.5))

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
                special_ability = self.item_choice(item_type, quality = quality, file = "tables")

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
