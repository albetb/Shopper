from shop import Shop
            
mario = Shop(   
                "Jeff", 
                city_level = 0, 
                party_level = 15, 
                shop_level = 2, 
                reputation = 0, 
                template = "Jeff"
            )

mario.generate_inventory()
mario.create_pdf()
