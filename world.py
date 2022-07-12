from shop import Shop
from city import City

class World:
    def __init__(self, name: str, party_level: int = 1) -> None:
        self.name = name if isinstance(name, str) else "ZAWARUDO"
        self.time = 0
        # [1, 20] Current party level
        self.party_level = int(max(1, min(20, party_level)))
        self.cities = []

    def add_city(self, name, city_level: int) -> None:
        if name in [item.name for item in self.cities]:
            print("A city with this name already exist.")
            return

        city = City(name, city_level)
        self.cities.append(city)

    def get_city(self, name: str) -> City:
        return list(filter(lambda x: x.name == name, self.cities))[0]

    def get_shop(self, city: str, shop: str) -> Shop:
        return self.get_city(city).get_shop(shop)

    def add_shop(self, city: str, shop: str, shop_level, template: str) -> None:
        c = self.get_city(city)
        c.add_shop(name = shop,
                   city_level = c.city_level,
                   party_level = self.party_level,
                   shop_level = shop_level,
                   reputation = 0,
                   template = template)

    def pass_time(self, hours, days = 0) -> None:
        for city in self.cities:
            city.passing_time(hours, days)
    
    def add_shop_level(self, city: str, shop: str, lv: float) -> None:
        self.get_shop(city, shop).add_shop_level(lv)

    def add_reputation(self, city: str, shop: str, rep: float) -> None:
        self.get_shop(city, shop).add_reputation(rep)

    def add_city_level(self, city: str, lv: int) -> None:
        self.get_city(city).add_city_level(lv)

    def add_party_level(self, lv: int) -> None:
        for city in self.cities:
            city.add_party_level(lv)
