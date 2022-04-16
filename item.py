from random import choices, randint
from json import load

class Item():
    def __init__(self) -> None:
        self.items = self.load_items()

    def load_items(self) -> dict:
        """ Load items list """
        with open('items.json', 'r') as file:
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
            "Potion" : self.new_potion(shop_level, quality),
            "Ring" : self.new_ring(shop_level, quality),
            "Rod" : self.new_rod(shop_level, quality), # None if quality is "Minor"
            "Staff" : self.new_staff(shop_level, quality), # None if quality is "Minor"
            "Wand" : self.new_wand(shop_level, quality),
            "Wondrous Item" : self.new_wondrous_item(shop_level, quality),
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
        weights = (item["Chance"] for item in self.items["Ammo"])
        return choices(population = self.items["Ammo"], weights = weights)[0]

    def new_weapon(self, shop_level: float) -> dict:
        """ Generate a new non magical Weapon """
        weights = (item["Chance"] + shop_level for item in self.items["Weapon"])
        return choices(population = self.items["Weapon"], weights = weights)[0]

    def new_armor(self, shop_level: float) -> dict:
        """ Generate a new non magical Armor """
        weights = (item["Chance"] + shop_level ** 0.5 for item in self.items["Armor"])
        return choices(population = self.items["Armor"], weights = weights)[0]

    def new_shield(self, shop_level: float) -> dict:
        """ Generate a new non magical Shield """
        weights = (item["Chance"] + shop_level ** 0.5 for item in self.items["Shield"])
        return choices(population = self.items["Shield"], weights = weights)[0]

    def new_potion(self, shop_level: float, quality: str) -> dict:
        """ Generate a new Potion """
        weights = (item[quality] + shop_level * (item[quality] > 0) for item in self.items["Potion"])
        return choices(population = self.items["Potion"], weights = weights)[0]

    def new_ring(self, shop_level: float, quality: str) -> dict:
        """ Generate a new Ring """
        weights = (item[quality] + shop_level * (item[quality] > 0) for item in self.items["Ring"])
        return choices(population = self.items["Ring"], weights = weights)[0]

    def new_rod(self, shop_level: float, quality: str) -> dict or None:
        """ Generate a new Rod, is None if quality is "Minor" """
        if quality == "Minor": return None
        weights = (item[quality] + shop_level * (item[quality] > 0) for item in self.items["Rod"])
        return choices(population = self.items["Rod"], weights = weights)[0]

    def new_staff(self, shop_level: float, quality: str) -> dict or None:
        """ Generate a new Staff, is None if quality is "Minor" """
        if quality == "Minor": return None
        weights = (item[quality] + shop_level * (item[quality] > 0) for item in self.items["Staff"])
        return choices(population = self.items["Staff"], weights = weights)[0]

    def new_wand(self, shop_level: float, quality: str) -> dict:
        """ Generate a new Wand """
        weights = (item[quality] + shop_level * (item[quality] > 0) for item in self.items["Wand"])
        return choices(population = self.items["Wand"], weights = weights)[0]

    def new_wondrous_item(self, shop_level: float, quality: str) -> dict:
        """ Generate a new Wondrous Item """
        num = int(min(randint(0, 2 * shop_level) + randint(1, 100), 100))
        return list(filter(lambda x: x["Number"] == num and x["Type"] == quality, self.items["Wondrous Item"]))[0]
