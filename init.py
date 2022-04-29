from shop import Shop, shop_names
from flask import Flask, render_template, url_for, request, redirect

app = Flask(__name__)

@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        player_level = request.form.get('player_level')
        city_level = request.form.get('city_level')
        shop_level = request.form.get('shop_level')
        reputation = request.form.get('reputation')
        shoptype = request.form.get('shoptype')
        mario = Shop(
                    "Mario",
                    city_level = int(city_level),
                    party_level = int(player_level),
                    shop_level = float(shop_level),
                    reputation = float(reputation),
                    template = shoptype
                )
        return render_template('index.html', shop_list = shop_names()
        , items = mario.inventory())
    elif request.method == 'GET':
        return render_template('index.html', shop_list = shop_names(), items = [])

if __name__ == "__main__":
    app.run(debug=True)
