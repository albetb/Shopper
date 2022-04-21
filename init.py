from shop import Shop
            
mario = Shop(   
                "Jeff", 
                city_level = 2, 
                party_level = 1, 
                shop_level = 0, 
                reputation = 0, 
                template = "Jeff"
            )

mario.generate_inventory()
mario.create_pdf(open = True)
