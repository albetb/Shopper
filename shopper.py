import random
import item
from json import load

def items():
    with open('items.json', 'r') as file:
        return load(file)
ITEMS = items()

class Shop:
    def __init__(self, name, shop_level=0, city_level=0, party_level=1, rep=0):
        self.name = name
        self.shop_level = shop_level # [0,..]
        self.city_level = city_level # [0,5] 0: paesino; 5: metropoli
        self.party_level = party_level # Maximum party level
        self.reputation = rep # [-10, +10]
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
        self.item = item.Item()
        
    def mod(self, item = 1):
        """ Modifies number of item generated based on some factors """
        return item * self.party_level * (1 + 0.1 * self.city_level) * 1.1 ** self.shop_level

    def set_level(self, sl=0, city_level=0, party_level=0):
        """ Set levels """
        self.shop_level = sl if sl > 0 else self.shop_level
        self.city_level = city_level if city_level > 0 else self.city_level
        self.party_level = party_level if party_level > 0 else self.party_level

    def add_rep(self, rep):
        """ Add or subtract reputation from the shop """
        self.reputation = max(-10, min(10, self.reputation + rep))

    def template(self, n):
        """ Generate a template for the shop """
        if n == 1:
            # "Mercante comune"
            self.item_mod["Good"] = 10
            self.item_mod["Potion"] = 1

    def generate_inventory(self):
        """ Generate a new inventory """
        for key in self.item_mod:
            if self.item_mod[key] == 0: continue

            num = self.item_mod[key] * self.party_level ** 0.5 * (1 + 0.1 * self.city_level) * 1.1 ** self.shop_level
            num = int(num if random.random() > num - int(num) else num + 1)
            
            for _ in range(num):
                self.stock.append(self.item.new(key, self.party_level, self.shop_level))
    
    def display(self):
        """ Display the shop's inventory """
        total = 0
        for index, item in enumerate(self.stock):
            if item in self.stock[:index]: continue
            total += item["Cost"]
            print(f'{self.stock.count(item)}x {item["Name"]}: {item["Cost"]}gp')
        print(f'\nTotal: {total}gp')
