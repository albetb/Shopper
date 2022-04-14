from item import Item
from random import random

class Shop:
    def __init__(self, name: str, shop_level: float = 0, city_level: int = 0, party_level: int = 1, reputation: float = 0) -> None:
        self.name = name
        self.shop_level = shop_level # [0,..]
        self.city_level = city_level # [0, 5] 0: paesino; 5: metropoli
        self.party_level = party_level # Maximum party level
        self.reputation = reputation # [-10, +10]
        self.item_mod = {
                        "Armor" : 0,
                        "Weapon" : 0,
                        "Good" : 0,
                        "Magic Armor" : 0,
                        "Magic Weapon" : 0,
                        "Potion" : 0,
                        "Ring" : 0,
                        "Rod" : 0,
                        "Scroll" : 0,
                        "Staff" : 0,
                        "Wand" : 0,
                        "Wondrous Item" : 0
                    }
        self.stock = []
        self.item = Item()

    def set_level(self, shop_level: float = 0, city_level: int = 0, party_level: int = 1) -> None:
        """ Set levels """
        self.shop_level = shop_level if shop_level > 0 else self.shop_level
        self.city_level = city_level if city_level > 0 else self.city_level
        self.party_level = party_level if party_level > 0 else self.party_level

    def add_reputation(self, reputation_added) -> None:
        """ Add or subtract reputation from the shop """
        self.reputation = max(-10, min(10, self.reputation + reputation_added))

    def template(self, number: int) -> None:
        """ Generate a template for the shop """
        if number == 1:
            # "Mercante comune"
            self.item_mod["Good"] = 10
            self.item_mod["Potion"] = 1

    def generate_inventory(self) -> None:
        """ Generate a new inventory """
        for key in self.item_mod:
            if self.item_mod[key] == 0: continue

            num = self.item_mod[key] * self.party_level ** 0.5 * (1 + 0.1 * self.city_level) * 1.1 ** self.shop_level
            num = int(num + 1 if random() < num - int(num) else num)
            
            for _ in range(num):
                new_item = self.item.new(key, self.party_level, self.shop_level)
                if isinstance(new_item, dict) and "Cost" in new_item.keys():
                    self.stock.append(new_item)
    
    def display(self) -> None:
        """ Display the shop's inventory """
        for index, item in enumerate(self.stock):
            if item in self.stock[:index]: continue
            print(f'{self.stock.count(item)}x {item["Name"]}: {item["Cost"]}gp')
        print(f'\nTotal value: {self.stock_value()}gp')

    def stock_value(self) -> float:
        return round(sum(item["Cost"] for item in self.stock), 2)
