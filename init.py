from shop import Shop, shop_names
from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/', methods=['POST', 'GET'])
def index():
    items = []
    default = {
        "player_level": 1,
        "city_level": 0,
        "shop_level": 0,
        "reputation": 0,
        "shop_type": ""
    }

    if request.method == 'POST':
        player_level = request.form.get('player_level')
        city_level = request.form.get('city_level')
        shop_level = request.form.get('shop_level')
        reputation = request.form.get('reputation')
        shop_type = request.form.get('shop_type')
        save_pdf = request.form.get('save')

        vendor = Shop(
                    "Shop",
                    city_level = int(city_level),
                    party_level = int(player_level),
                    shop_level = float(shop_level),
                    reputation = float(reputation),
                    template = shop_type
                )

        default = {
            "player_level": player_level,
            "city_level": city_level,
            "shop_level": shop_level,
            "reputation": reputation,
            "shop_type": shop_type
        }
        items = vendor.inventory()
        
        if save_pdf:
            vendor.display(1)

    return render_template('index.html',
                           shop_list = shop_names(),
                           items = items,
                           default = default)

if __name__ == "__main__":
    app.run(debug=True)
