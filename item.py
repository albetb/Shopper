import random
from json import load

class Item():
    def __init__(self) -> None:
        self.items = self.gen_items()

    def gen_items(self):
        """ Load items list """
        with open('items.json', 'r') as file:
            return load(file)

    def new(self, type, party_level = 1, shop_level = 0):
        """ Generate a new item """
        quality = self.quality()
        if type == "Good":
            max_cost = max((item["Cost"] for item in self.items["Good"])) + 2
            return random.choices(population = self.items["Good"],
                                  weights = ((max_cost - item["Cost"]) ** 0.5 for item in self.items["Good"]))[0]
        if type == "Potion":
            potions = [item for item in self.items["Potion"]]
            return random.choices(population = potions,
                                  weights = (item[quality] for item in potions))[0]
    
    def quality(self, party_level = 1):
        """ Generate a random quality for an item based on party level """
        major = min(0 if party_level < 10 else 1 if party_level == 10 else 5 * (party_level - 10), 100)
        medium = min(0 if party_level < 5 else 1 if party_level == 5 else 5 * (party_level - 5), 100 - major)
        minor = max(0, 100 - medium - major)
        return random.choices(population = ("Minor", "Medium", "Major"),
                              weights = (minor, medium, major))[0]
