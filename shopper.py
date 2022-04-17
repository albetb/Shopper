from item import Item
from random import random, randint
from json import load

class Shop:
    def __init__(self, name: str, shop_level: float = 0, city_level: int = 0, party_level: int = 1, reputation: float = 0, template: str = "") -> None:
        self.name = name # Name of the shop or of the merchant
        self.shop_level = max(0, min(10, shop_level)) # [0, 10] Level of the merchant
        self.city_level = int(max(0, min(5, city_level))) # [0, 5] Size of city 0: Small village; 5: Metropolis
        self.party_level = int(max(1, min(20, party_level))) # [1, 20] Current party level
        self.reputation = max(-10, min(10, reputation)) # [-10, +10] Attitude of the merchant to the party
        self.stock = [] # Items selled by the shop
        self.item = Item()
        
        if template != "":
            self.template(template)
        else:
            self.item_mod = {
                                "Good" : 0,
                                "Weapon" : 0,
                                "Armor" : 0,
                                "Magic Armor" : 0,
                                "Magic Weapon" : 0,
                                "Potion" : 0,
                                "Ring" : 0,
                                "Rod" : 0,
                                "Staff" : 0,
                                "Wand" : 0,
                                "Wondrous Item" : 0,
                                "Scroll" : 0
                            }

    def set_level(self, shop_level: float = 0, city_level: int = 0, party_level: int = 1) -> None:
        """ Set levels """
        self.shop_level = max(0, min(10, shop_level)) if shop_level > 0 else self.shop_level
        self.city_level = int(max(0, min(5, city_level)) if city_level > 0 else self.city_level)
        self.party_level = int(max(1, min(20, party_level)) if party_level > 1 else self.party_level)

    def add_shop_level(self, level_added: float) -> None:
        """ Add or subtract shop level from the shop [0, 10] """
        self.shop_level = max(0, min(10, self.shop_level + level_added))

    def add_city_level(self, level_added: int) -> None:
        """ Add or subtract city level from the shop's city [0, 5] """
        self.city_level = int(max(0, min(5, self.city_level + level_added)))

    def add_party_level(self, level_added: int) -> None:
        """ Add or subtract level to the party [1, 20] """
        self.party_level = int(max(1, min(20, self.party_level + level_added)))

    def add_reputation(self, reputation_added: float) -> None:
        """ Add or subtract reputation from the shop [-10, 10] """
        self.reputation = max(-10, min(10, self.reputation + reputation_added))
    
    def load_shop(self) -> dict:
        """ Load shop type for template """
        with open(f"shops.json", "r") as file:
            return load(file)

    def template(self, name: str = "") -> None:
        """ Select a template for the shop """
        shop_types = self.load_shop()
        name = "" if name not in (item["Name"] for item in shop_types["Type"]) else name
        shop = list(filter(lambda x: x["Name"] == name, shop_types["Type"]))[0]
        self.item_mod = shop["Modifier"]
        self.shop_level = max(self.shop_level, shop["Min level"])

    def generate_inventory(self) -> None:
        """ Generate a new inventory, delete old one if any """
        self.stock = []
        for key in self.item_mod:
            if self.item_mod[key] == 0: continue

            num = self.item_mod[key] # Number of item generated
            num *= self.party_level ** 0.5 
            num *= 1 + 0.1 * self.city_level
            num *= 1.1 ** self.shop_level
            num = int(num + 1 if random() < num - int(num) else num)
            
            for _ in range(num):
                self.add_item(self.item.new(key, self.shop_level, self.party_level))
            
            # Generate a random amount of Ammo or Shields if type is Weapon or Armor
            if key == "Weapon": self.generate_ammo()
            elif key == "Armor": self.generate_shield()

    def add_item(self, item: dict or None) -> None:
        """ Add an item on the stock if item is not None"""
        if item is not None and isinstance(item, dict) and "Cost" in item.keys():
            if item["Cost"] > 5: # Randomly change item cost
                mod = (100 + randint(-20, +20) - self.reputation * 2 + self.city_level) / 100
                item["Cost"] = int(max(round(item["Cost"] * mod, 0), 1))
            self.stock.append(item)

    def generate_ammo(self) -> None:
        """ Generate a random amount of Ammo, when shop have Weapons """
        num = randint(0, int(self.item_mod["Weapon"]))
        for _ in range(num):
            self.add_item(self.item.new("Ammo", self.shop_level, self.party_level))

    def generate_shield(self) -> None:
        """ Generate a random amount of Shield, when shop have Armors """
        num = randint(int(self.item_mod["Armor"] >= 1), int(self.item_mod["Armor"]))
        for _ in range(num):
            self.add_item(self.item.new("Shield", self.shop_level, self.party_level))
    
    def display(self) -> None:
        """ Display the shop's inventory """
        for index, item in enumerate(self.stock):
            if item in self.stock[:index]: continue
            print(f'{self.stock.count(item)}x {item["Name"]}: {item["Cost"]}gp')

    def stock_value(self) -> float:
        """ Calculate entire stock value of the shop """
        return round(sum(item["Cost"] for item in self.stock), 2)
