from random import choices
from json import load

class Item():
    def __init__(self) -> None:
        self.items = self.gen_items()

    def gen_items(self) -> dict:
        """ Load items list """
        with open('items.json', 'r') as file:
            return load(file)

    def new(self, type: str, party_level: int = 1, shop_level: float = 0) -> dict or None:
        """ Generate a new item """
        quality = self.quality(party_level)
        if type == "Good":
            max_cost = max((item["Cost"] for item in self.items["Good"])) + 2
            return choices(population = self.items["Good"],
                           weights = ((max_cost - item["Cost"]) ** 0.5 for item in self.items["Good"]))[0]
        if type == "Potion":
            return choices(population = self.items["Potion"],
                           weights = (item[quality] for item in self.items["Potion"]))[0]
    
    def quality(self, party_level: int = 1) -> str:
        """ Generate a random quality for an item based on party level """
        major = min(0 if party_level < 10 else 1 if party_level == 10 else 5 * (party_level - 10), 100)
        medium = min(0 if party_level < 5 else 1 if party_level == 5 else 5 * (party_level - 5), 100 - major)
        minor = max(0, 100 - medium - major)
        return choices(population = ("Minor", "Medium", "Major"),
                       weights = (minor, medium, major))[0]
