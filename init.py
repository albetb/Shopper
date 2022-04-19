from shop import Shop
            
mario = Shop(   
                "Mario", 
                city_level = 1, 
                party_level = 5, 
                shop_level = 1, 
                reputation = 0, 
                template = "Blacksmith"
            )
mario.generate_inventory()
mario.display()
