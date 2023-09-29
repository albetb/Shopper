from shop import Shop, shop_names
from flask import Flask, render_template, request, jsonify

app = Flask(__name__, static_url_path="/static", static_folder="static")

@app.route('/', methods=['GET'])
def index():
    default = {
        "player_level": 1,
        "city_level": 0,
        "shop_level": 0,
        "reputation": 0,
        "shop_type": ""
    }

    return render_template('index.html',
                           shop_list = shop_names(),
                           default = default)

@app.route('/getShop', methods=["POST"])
def getShop():

    data = request.get_json()

    try:
        vendor = Shop(
                "Shop",
                city_level = int(data["city_level"]),
                party_level = int(data["player_level"]),
                shop_level = float(data["shop_level"]),
                reputation = float(data["reputation"]),
                template = data["shop_type"]
            )
    except:
        return jsonify(items=[])
    
    items = vendor.inventory()

    return jsonify(items=items)

def run():
    port = 5000
    app.run(host='0.0.0.0', port=port, debug=False)

if __name__ == "__main__":
    run()
