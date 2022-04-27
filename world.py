from shop import Shop
from loader import save_file, load_file

class World:
    def __init__(self, name: str, party_level: int = 1) -> None:
        self.name = name if isinstance(name, str) else "ZAWARUDO"
        self.time = 0
        # [1, 20] Current party level
        self.party_level = int(max(1, min(20, party_level)))

        self.cities = []

    def add_city(self, name, city_level: int):
        city = City(name, city_level)
        city.add_shop("Gino")
        self.cities.append(city)

    def serialize(self) -> dict:
        """ Serialize game stats as a dictionary to save it in a JSON file """
        return {
            "population": self.population,
            "resource": {
                "food": self.food,
                "wood": self.wood
                },
            "building": {
                "house": self.house,
                "granary": self.granary,
                "storage": self.storage
                },
            "occupation": {
                "harvester": self.harvester,
                "lumber": self.lumber
                },
            "time": self.time,
            "events": self.events.serialize_events()
            }


class City:
    def __init__(self, name: str, city_level: int = 0) -> None:
        self.name = name if isinstance(name, str) else "NONAME"
        # [0, 5] Size of the city 0: Small village; 5: Metropolis
        self.city_level = int(max(0, min(5, city_level)))

        self.shops = []

    def add_shop(self, name, ):
        shop = Shop(
            name,
            city_level = 3,
            party_level = 20,
            shop_level = 10,
            reputation = 0,
            template = "Magic Blacksmith"
        )
        self.shops.append(shop)

aa = World("Terra")
aa.add_city("asdasda",0)
save_file("test", aa)