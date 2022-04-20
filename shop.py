from item import Item
from random import random, randint, choices, choice
from json import load
from fpdf import FPDF
from datetime import datetime

class Shop:
    def __init__(self, name: str, 
                       shop_level: float = 0, 
                       city_level: int = 0, 
                       party_level: int = 1, 
                       reputation: float = 0, 
                       template: str = "" ) -> None:
        self.name = name # Name of the shop or of the merchant
        self.shop_level = max(0, min(10, shop_level)) # [0, 10] Level of the merchant
        self.city_level = int(max(0, min(5, city_level))) # [0, 5] Size of city 0: Small village; 5: Metropolis
        self.party_level = int(max(1, min(20, party_level))) # [1, 20] Current party level
        self.reputation = max(-10, min(10, reputation)) # [-10, +10] Attitude of the merchant to the party
        self.stock = [] # Items selled by the shop
        self.item = Item() # Item generator
        self.gold = 0 # Gold possessed
        self.hours_counter = 0 # For counting time

        if template != "":
            self.template(template)
        else:
            self.item_mod = {
                                "Good" : 0,
                                "Weapon" : 0,
                                "Armor" : 0,
                                "Ammo" : 0,
                                "Shield" : 0,
                                "Magic Weapon" : 0,
                                "Magic Armor" : 0,
                                "Potion" : 0,
                                "Ring" : 0,
                                "Rod" : 0,
                                "Staff" : 0,
                                "Wand" : 0,
                                "Wondrous Item" : 0,
                                "Scroll" : 0
                            }
    
    def base_gold(self, party_level: int, shop_level: float) -> float:
        """ Return base gold for a shop """
        return 1000 * int(party_level) ** 1.5 * int(shop_level) ** 1.05

    def add_shop_level(self, level_added: float) -> None:
        """ Add shop level from the shop [0, 10] """
        lv = self.shop_level
        self.shop_level = max(self.shop_level, min(10, self.shop_level + level_added))
        self.gold += self.base_gold(self.party_level, self.shop_level) - self.base_gold(self.party_level, lv)
        if int(lv) != int(self.shop_level):
            print(f"{self.name} has reached lv{int(self.shop_level)}!")

    def add_city_level(self, level_added: int) -> None:
        """ Add or subtract city level from the shop's city [0, 5] """
        self.city_level = int(max(0, min(5, self.city_level + level_added)))

    def add_party_level(self, level_added: int) -> None:
        """ Add level to the party [1, 20] """
        lv = self.party_level
        self.party_level = int(max(self.party_level, min(20, self.party_level + level_added)))
        self.gold += self.base_gold(self.party_level, self.shop_level) - self.base_gold(lv, self.shop_level)

    def add_reputation(self, reputation_added: float) -> None:
        """ Add or subtract reputation from the shop [-10, 10] """
        self.reputation = max(-10, min(10, self.reputation + reputation_added))

    def load_shop_type(self) -> dict:
        """ Load shop type for template """
        with open(f"config/shops.json", "r") as file:
            return load(file)

    def template(self, name: str = "") -> None:
        """ Select a template for the shop """
        shop_types = self.load_shop_type()
        # Get default shop if shop name don't exist
        name = "" if name not in (item["Name"] for item in shop_types["Type"]) else name
        shop = list(filter(lambda x: x["Name"] == name, shop_types["Type"]))[0]
        self.shop_level = max(self.shop_level, shop["Min level"])
        self.gold = self.base_gold(self.party_level, self.shop_level)
        self.item_mod = shop["Modifier"]
        # If has Weapon or Armor add Ammo or Shield to the inventory
        if "Weapon" in self.item_mod.keys() and self.item_mod["Weapon"] > 0:
            self.item_mod["Ammo"] = self.item_mod["Weapon"] * 0.6
        if "Armor" in self.item_mod.keys() and self.item_mod["Armor"] > 0:
            self.item_mod["Shield"] = self.item_mod["Armor"] * 0.4

    def sell_something(self) -> None:
        """ Sell 1/10 random items """
        item_number = round(sum(item["Number"] for item in self.stock), 2)
        if item_number < 10:
            prob = item_number / 10
        else:
            prob = 1
        if random() < prob:
            num = randint(0, max(item_number // 10, 1))
            for _ in range(num):
                items_possessed = list(filter(lambda x: x["Number"] > 0, self.stock))
                item = dict(choice(items_possessed))
                for selled_item in self.stock:
                    if selled_item["Name"] == item["Name"]:
                        print(f"Selled: {selled_item['Name']}")
                        selled_item["Number"] -= 1
                        self.gold += self.true_cost(selled_item)

    def passing_time(self, hours: int = 0, days: int = 0) -> None:
        """ Pass time, shop sell items, restock items and spend coins """
        starting_time = int(self.hours_counter)
        for _ in range(starting_time, starting_time + hours + days * 24):
            self.hours_counter += 1
            if self.gold > self.base_gold(self.party_level, self.shop_level):
                self.gold *= 0.9
                self.add_shop_level(0.01)
            self.gold -= choices(population = (0, 1), weights = (2, 1))[0]
            if self.hours_counter % (24 * 3) == 0: # Restock items every 3 daysa
                self.restock()
            if self.is_open():
                self.sell_something()

    def is_open(self) -> bool:
        """ Check if the shop is open """
        return all((
                    8 < self.hours_counter % 24 < 18, # Normal opening time 9 - 18
                    self.hours_counter % 24 != 13, # Lunch break 13-14
                    not self.hours_counter % 168 > 144 # Day off every 7 days
                ))

    def restock(self) -> None:
        """ Restock some item in the inventory """
        for key in self.item_mod.keys():
            item_number = self.mod_item_number(key)
            if self.count_item_type(key) < item_number:
                for _ in range(item_number - self.count_item_type(key)):
                    item = self.item.new(key, self.shop_level, self.party_level)
                    if item is not None and isinstance(item, dict) and "Name" in item.keys() and self.gold - 100 >= item['Cost'] * 0.95:
                        print(f"Restocked: {item['Name']}")
                        self.add_item(item, key)
                        self.gold -= item['Cost'] * 0.95
        self.sort_by_type()

    def count_item_type(self, item_type: str) -> int:
        """ Count how many item of the type are in the stock """
        return int(sum(item["Number"] for item in self.stock if item["Item Type"] == item_type))

    def generate_inventory(self) -> None:
        """ Generate a new inventory, delete old one if any """
        self.stock = []
        for key in self.item_mod:
            for _ in range(self.mod_item_number(key)):
                self.add_item(self.item.new(key, self.shop_level, self.party_level), key)
        inv_value = lambda : sum(item["Cost"] for item in self.stock) * 0.95
        self.sort_by_cost()
        while inv_value() > self.gold - 100:
            if len(self.stock) > 0:
                self.stock.pop()
        self.gold -= inv_value()
        self.sort_by_type()

    def sort_by_type(self):
        """ Sort inventory by name then type """
        stock = list(self.stock)
        stock.sort(key=lambda item: item["Name"])
        stock.sort(key=lambda item: item["Item Type"])
        self.stock = stock

    def sort_by_cost(self):
        """ Sort inventory by cost """
        stock = list(self.stock)
        stock.sort(key=lambda item: item["Cost"])
        self.stock = stock

    def mod_item_number(self, key: str) -> int:
        """ Modifies the number of item generated based on levels """
        num = self.item_mod[key]
        num *= 1.1 ** self.party_level
        num *= 1 + 0.1 * self.city_level
        num *= 1.05 ** self.shop_level
        return int(num + 1 if random() < num - int(num) else num)

    def add_item(self, added_item: dict or None, item_type: str) -> None:
        """ Add an item on the stock if item is not None """
        if added_item is not None and isinstance(added_item, dict) and "Cost" in added_item.keys():
            for item in self.stock:
                if item["Name"] == added_item["Name"]:
                    item["Number"] += 1
                    break
            else:
                added_item["Price Modifier"] = randint(-20, +20)
                added_item["Number"] = 1
                added_item["Item Type"] = item_type
                self.stock.append(added_item)
    
    def display(self) -> None:
        """ Display the shop's inventory """
        if not self.is_open():
            reason = "day off" if self.hours_counter % 168 > 144 else "lunch break" if self.hours_counter % 24 == 13 else f"{self.hours_counter % 24} o'clock"
            print(f"~~~ The shop is closed (it's {reason}) ~~~")
        else:
            print("_" * 50)
            shop_name = self.name if len(self.name) < 31 else f"{str(self.name)[:29]}.."
            shop_name = f" {shop_name}'s inventory: "
            shop_name = "| " + "~" * ((47 - len(shop_name)) // 2) + shop_name
            shop_name = shop_name + "~" * (48 - len(shop_name)) + " |"
            print(shop_name)
            print("|" + " " * 48 + "|")
            for item in self.stock:
                if item["Number"] > 0:
                    name = item["Name"] if len(item["Name"]) < 32 else f"{str(item['Name'])[:30]}.."
                    txt = f'| {item["Number"]}x {name} '
                    cst = str(self.true_cost(item))
                    txt = txt + "." * (44 - len(txt) - len(cst)) + f" {cst} gp |"
                    print(txt)
            print("|" + " " * 48 + "|")
            cost = f"| > Gold: {int(self.gold)} gp"
            print(cost + " " * (49 - len(cost)) + "|")
            print("|" + "_" * 48 + "|")

    def create_pdf(self) -> None:
        """ Create a pdf of the inventory """
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Courier", size = 12)

        print = lambda t, l = "": pdf.cell(190, 5, txt = t, ln = 1, align = 'C', link = l)

        print("_" * 60)
        print("|" + " " * 58 + "|")
        shop_name = self.name if len(self.name) < 41 else f"{str(self.name)[:39]}.."
        shop_name = f" {shop_name}'s inventory: "
        shop_name = "| " + "~" * ((57 - len(shop_name)) // 2) + shop_name
        shop_name = shop_name + "~" * (58 - len(shop_name)) + " |"
        print(shop_name)
        print("|" + " " * 58 + "|")
        for item in self.stock:
            if item["Number"] > 0:
                name = item["Name"] if len(item["Name"]) < 42 else f"{str(item['Name'])[:40]}.."
                txt = f'| {item["Number"]}x {name} '
                cst = str(self.true_cost(item))
                txt = txt + "." * (54 - len(txt) - len(cst)) + f" {cst} gp |"
                link = ""
                if "Link" in item.keys():
                    link = item["Link"]
                elif "Ability" in item.keys() and isinstance(item["Ability"], list) and len(item["Ability"]) > 0:
                    link = item["Ability"][0]["Link"]
                print(txt, link)
        print("|" + " " * 58 + "|")
        cost = f"| > Gold: {int(self.gold)} gp"
        print(cost + " " * (59 - len(cost)) + "|")
        print("|" + "_" * 58 + "|")
        
        now = datetime.now().strftime("%y%m%d%H%M%S")
        pdf.output(f"created/{self.name}'s inventory - {now}.pdf")  

    def true_cost(self, item: dict) -> int or float:
        """ Modifies cost of an item """
        mod = (100 + item["Price Modifier"] - self.reputation * 2 + self.city_level) / 100
        cost = max(round(item["Cost"] * mod, 2), 0)
        dec = 1 if cost < 100 else 5 if cost < 1000 else 10
        return cost if cost < 1 else int(round(cost / dec, 0) * dec)

    def stock_value(self) -> float:
        """ Calculate entire stock value of the shop """
        return round(sum(self.true_cost(item) for item in self.stock), 2)
