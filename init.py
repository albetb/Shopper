from shop import Shop
            
mario = Shop(   
                "Mario", 
                city_level = 1, 
                party_level = 5, 
                shop_level = 2,
                reputation = 0, 
                template = ""
            )

mario.generate_inventory()
mario.display(2)
