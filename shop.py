from item import new
from random import random, randint, choices, choice
from fpdf import FPDF
from datetime import datetime
from os import path, getcwd
try:
    from os import startfile
except ImportError:
    startfile = lambda *x, **args: None
from loader import load_file


def shop_names(all = False) -> list:
    shop_types = load_file("shops")
    return [item["Name"] 
            for item in shop_types["Type"]
            if item["Name"] != "Jeff" or all]

class Shop:
    def __init__(self, name: str,
                       shop_level: float = 0,
                       city_level: int = 0,
                       party_level: int = 1,
                       reputation: float = 0,
                       template: str = "") -> None:
        self.name = name # Name of the shop or of the merchant
        # [0, 10] Level of the merchant
        self.shop_level = round(max(0, min(10, shop_level)), 2)
        # [0, 5] Size of city 0: Small village; 5: Metropolis
        self.city_level = int(max(0, min(5, city_level)))
        # [1, 20] Current party level
        self.party_level = int(max(1, min(20, party_level)))
        # [-10, +10] Attitude of the merchant to the party
        self.reputation = round(max(-10, min(10, reputation)), 2)
        self.stock = [] # Items selled by the shop
        self.gold = 0 # Gold possessed
        self.hours_counter = 0 # For counting time
        self.arcane_chance = 0.7 # Base arcane scroll chance
        self.__template(template) # Load template for the shop

    def add_shop_level(self, lv: float) -> None:
        """ Add shop level from the shop [0, 10] """
        shop_lv = self.shop_level
        lv_sum = self.shop_level + lv
        self.shop_level = round(max(self.shop_level, min(10, lv_sum)), 2)
        old_gold = self.__base_gold(self.party_level, shop_lv)
        new_gold = self.__base_gold(self.party_level, self.shop_level)
        self.gold += new_gold - old_gold
        if int(shop_lv) != int(self.shop_level):
            print(f"{self.name} has reached lv {int(self.shop_level)}!")

    def add_city_level(self, lv: int) -> None:
        """ Add or subtract city level from the shop's city [0, 5] """
        self.city_level = int(max(0, min(5, self.city_level + lv)))

    def add_party_level(self, lv: int) -> None:
        """ Add level to the party [1, 20] """
        party_lv = self.party_level
        add_lv = self.party_level + lv
        self.party_level = int(max(self.party_level, min(20, add_lv)))
        old_gold = self.__base_gold(party_lv, self.shop_level)
        new_gold = self.__base_gold(self.party_level, self.shop_level)
        self.gold += new_gold - old_gold

    def add_reputation(self, rep: float) -> None:
        """ Add or subtract reputation from the shop [-10, 10] """
        self.reputation = round(max(-10, min(10, self.reputation + rep)), 2)

    def passing_time(self, hours: int = 0, days: int = 0) -> None:
        """ Pass time, shop sell items, restock items and spend coins """
        for _ in range(hours + days * 24):
            self.hours_counter += 1
            # Invest some gold and gain levels
            if self.gold > self.__base_gold(self.party_level, self.shop_level):
                self.gold *= 0.9
                self.add_shop_level(0.01 * (10 - self.shop_level))
            # Spend a little amount of gold per day
            self.gold -= choices(population = (0, 1), weights = (2, 1))[0]
            # Restock items every 3 days
            if self.hours_counter % (24 * 3) == 0:
                self.__restock()
            if self.__is_open():
                self.__sell_something()

    def sort_by_type(self) -> None:
        """ Sort inventory by name then type """
        stock = list(self.stock)
        stock.sort(key=lambda item: item["Name"])
        stock.sort(key=lambda item: item["Item Type"])
        self.stock = stock

    def sort_by_cost(self) -> None:
        """ Sort inventory by cost """
        stock = list(self.stock)
        stock.sort(key=lambda item: item["Cost"])
        self.stock = stock

    def inventory(self) -> list:
        return [{
                    "Number": item["Number"],
                    "Name": item["Name"],
                    "Link": "" if "Link" not in item.keys() else item["Link"],
                    "Type": item["Item Type"],
                    "Cost": self.true_cost(item)
                } 
                for item in self.stock
                if item["Number"] > 0]

    def __template(self, __template) -> None:
        """ Select a template for the shop """
        shop_types = load_file("shops")
        type_name = shop_names(all = True)
        # Get default shop if shop name don't exist
        self.type = "" if __template not in type_name else __template
        shop = list(filter(lambda x: x["Name"] == self.type,
                           shop_types["Type"]))[0]
        self.shop_level = max(self.shop_level, shop["Min level"])
        self.gold = self.__base_gold(self.party_level, self.shop_level)
        self.item_mod = shop["Modifier"]
        if "Arcane Chance" in shop.keys():
            self.arcane_chance = shop["Arcane Chance"]
        # If has Weapon or Armor add Ammo or Shield to the inventory
        if "Weapon" in self.item_mod.keys() and self.item_mod["Weapon"] > 0:
            self.item_mod["Ammo"] = self.item_mod["Weapon"] * 0.6
        if "Armor" in self.item_mod.keys() and self.item_mod["Armor"] > 0:
            self.item_mod["Shield"] = self.item_mod["Armor"] * 0.4
        self.__generate_inventory()
    
    def __base_gold(self, party_level: int, shop_level: float) -> float:
        """ Return base gold for a shop """
        return int(1000 * party_level ** 1.5 * 1.1 ** shop_level)

    def __sell_something(self) -> None:
        """ Sell 1/10 random items """
        item_number = round(sum(item["Number"] for item in self.stock), 2)
        if random() < item_number / 10: # If have < 10 item can sell nothing
            num = randint(0, max(item_number // 10, 1))
            for _ in range(num):
                items_possessed = list(filter(lambda x: x["Number"] > 0,
                                              self.stock))
                item = dict(choice(items_possessed))
                for selled_item in self.stock:
                    if selled_item["Name"] == item["Name"]:
                        selled_item["Number"] -= 1
                        self.gold += self.true_cost(selled_item, False)

    def __is_open(self) -> bool:
        """ Check if the shop is open """
        return all((
                    8 < self.hours_counter % 24 < 18, # Opening time 9 - 18
                    self.hours_counter % 24 != 13, # Lunch break 13-14
                    not self.hours_counter % 168 > 144 # Day off every 7 days
                ))

    def __restock(self) -> None:
        """ Restock some item in the inventory """
        for key in self.item_mod.keys():
            item_number = self.__mod_item_number(key)
            if self.__count_item_type(key) < item_number:
                for _ in range(item_number - self.__count_item_type(key)):
                    item = new(key,
                               self.shop_level,
                               self.party_level,
                               self.arcane_chance)
                    if isinstance(item, dict) and "Name" in item.keys():
                        if self.gold - 100 >= item['Cost'] * 0.95:
                            print(f"Restocked: {item['Name']}")
                            self.__add_item(item, key)
                            self.gold -= item['Cost'] * 0.95
        self.sort_by_type()

    def __count_item_type(self, item_type: str) -> int:
        """ Count how many item of the type are in the stock """
        return int(sum(item["Number"]
                       for item in self.stock
                       if item["Item Type"] == item_type))

    def __generate_inventory(self) -> None:
        """ Generate a new inventory, delete old one if any """
        self.stock = []
        for key in self.item_mod:
            for _ in range(self.__mod_item_number(key)):
                self.__add_item(
                    new(key,
                        self.shop_level,
                        self.party_level,
                        self.arcane_chance),
                    key)
        inv_value = lambda : sum(item["Cost"] for item in self.stock) * 0.95
        self.sort_by_cost()
        while inv_value() > self.gold - 100:
            if len(self.stock) > 0:
                self.stock.pop()
        self.gold -= inv_value()
        self.sort_by_type()

    def __mod_item_number(self, key: str) -> int:
        """ Modifies the number of item generated based on levels """
        num = self.item_mod[key]
        num *= 1.1 ** self.party_level
        num *= 1 + 0.1 * self.city_level
        num *= 1.05 ** self.shop_level
        return int(num + 1 if random() < num - int(num) else num)

    def __add_item(self, added_item: dict or None, item_type: str) -> None:
        """ Add an item on the stock if item is dict """
        if isinstance(added_item, dict) and "Cost" in added_item.keys():
            for item in self.stock:
                if item["Name"] == added_item["Name"]:
                    item["Number"] += 1
                    break
            else:
                added_item["Price Modifier"] = randint(-20, +20)
                added_item["Number"] = 1
                added_item["Item Type"] = item_type
                self.stock.append(added_item)

    def display(self, is_pdf: int = 0) -> None:
        """ Display the inventory
            or if is_pdf > 0 create a pdf of the inventory
            and if is_pdf > 1 open it """
        if is_pdf > 0:
            pdf = FPDF()
            pdf.add_page()
            pdf.set_font("Courier", size = 12)

            fprint = lambda t, l = "": pdf.cell(190, 5, txt = t, ln = 1,
                                                align = 'C', link = l)
        else:
            fprint = lambda t, l = "" : print(t)
            if not self.__is_open():
                reason = f"{self.hours_counter % 24} o'clock"
                if self.hours_counter % 168 > 144:
                    reason = "day off"
                elif self.hours_counter % 24 == 13:
                    reason = "lunch break"
                fprint(f"~~~ The shop is closed (it's {reason}) ~~~")
                return

        #  _________________________________________________________ 
        fprint(" " + "_" * 58 + " ")
        # |                                                          |
        fprint("|" + " " * 58 + "|")
        shop_name = self.name
        if len(self.name) >= 41:
            shop_name = f"{str(self.name)[:39]}.."
        shop_name = f" {shop_name}'s inventory: "
        shop_name = "| " + "~" * ((57 - len(shop_name)) // 2) + shop_name
        shop_name = shop_name + "~" * (58 - len(shop_name)) + " |"
        # | ~~~~~~~~~~~~~~~~~~ Mario's inventory: ~~~~~~~~~~~~~~~~~~ |
        fprint(shop_name)
        info = f"| {self.type} lv: {self.shop_level}"
        cost = f" Gold: {int(self.gold)} gp |"
        info += " " * (60 - len(info) - len(cost)) + cost
        # | Blacksmith lv: 1                          Gold: 11828 gp |
        fprint(info)
        info2 = f"| > Reputation: {self.reputation}"
        info2 += f", Player lv: {self.party_level}"
        info2 += " " * (59 - len(info2)) + "|"
        # | > Reputation: 0, Player lv: 5                            |
        fprint(info2)
        # |                                                          |
        fprint("|" + " " * 58 + "|")
        for item in self.stock:
            if item["Number"] > 0:
                name = item["Name"]
                if len(item["Name"]) >= 42:
                    name = f"{str(item['Name'])[:40]}.."
                txt = f'| {item["Number"]}x {name} '
                cst = str(self.true_cost(item))
                txt = txt + "." * (54 - len(txt) - len(cst)) + f" {cst} gp |"
                if is_pdf > 0:
                    link = ""
                    if "Link" in item.keys():
                        link = item["Link"]
                    elif "Ability" in item.keys():
                        # Add first special ability link
                        if isinstance(item["Ability"], list):
                            if len(item["Ability"]) > 0:
                                link = item["Ability"][0]["Link"]
                    fprint(txt, link)
                else:
                    # | 1x Dagger +3 ...................... 19950 gp |
                    fprint(txt)
        # |                                                          |
        fprint("|" + " " * 58 + "|")
        # |__________________________________________________________|
        fprint("|" + "_" * 58 + "|")
        
        if is_pdf > 0:
            now = datetime.now().strftime("%y%m%d%H%M%S")
            filename = f"created\{self.name}'s inventory - {now}.pdf"
            pdf.output(filename)
        if is_pdf > 1:
            file_path = path.join(getcwd(), filename)
            startfile(file_path)

    def true_cost(self, item: dict, for_party: bool = True) -> int or float:
        """ Modifies cost of an item,
            if for_party is True reduce cost based on reputation """
        rep = self.reputation * 2 if for_party else 0
        mod = (100 + item["Price Modifier"] - rep + self.city_level) / 100
        cost = max(round(item["Cost"] * mod, 2), 0)
        dec = 1 if cost < 100 else 5 if cost < 1000 else 10
        return cost if cost < 1 else int(round(cost / dec, 0) * dec)
