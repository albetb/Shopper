from shop import Shop

class City:
    def __init__(self, name: str, city_level: int = 0) -> None:
        self.name = name if isinstance(name, str) else "NONAME"
        # [0, 5] Size of the city 0: Small village; 5: Metropolis
        self.city_level = int(max(0, min(5, city_level)))
        self.shops = []

    def add_shop(self, name: str,
            city_level: int = 0,
            party_level: int = 0,
            shop_level: float = 0,
            reputation: float = 0,
            template: str = "") -> None:

        if name in [shop.name for shop in self.shops]:
            print("A shop with this name already exist.")
            return

        shop = Shop(
            name,
            city_level = city_level,
            party_level = party_level,
            shop_level = shop_level,
            reputation = reputation,
            template = template
        )
        self.shops.append(shop)

    def get_shop(self, name: str) -> Shop:
        return list(filter(lambda x: x.name == name, self.shops))[0]

    def add_city_level(self, lv: int) -> None:
        for shop in self.shops:
            shop.add_city_level(lv)
        self.city_level += lv

    def add_party_level(self, lv: int) -> None:
        for shop in self.shops:
            shop.add_party_level(lv)
        
    def add_shop_level(self, shop: str, lv: int) -> None:
        self.get_shop(shop).add_shop_level(lv)
        
    def add_reputation(self, shop: str, rep: int) -> None:
        self.get_shop(shop).add_reputation(rep)
