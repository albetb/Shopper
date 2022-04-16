from shopper import Shop
            
mario = Shop("Mario", city_level = 2, party_level = 6, shop_level = 1, template = "Blacksmith")
mario.generate_inventory()
mario.display()
