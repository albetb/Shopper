from shop import Shop

mario = Shop(
                "Mario",
                city_level = 3,
                party_level = 5,
                shop_level = 5,
                reputation = 0,
                template = "Mage Merchant"
            )

mario.generate_inventory()
mario.display(2)
