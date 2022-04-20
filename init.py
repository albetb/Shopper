from shop import Shop
            
mario = Shop(   
                "Mario", 
                city_level = 0, 
                party_level = 5, 
                shop_level = 2, 
                reputation = 0, 
                template = "Mage Merchant"
            )

mario.generate_inventory()
mario.create_pdf()
