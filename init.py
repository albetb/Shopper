from shop import Shop
from flask import Flask, render_template, url_for, request, redirect

app = Flask(__name__)

mario = Shop(
                "Mario",
                city_level = 3,
                party_level = 20,
                shop_level = 10,
                reputation = 0,
                template = "Magic Blacksmith"
            )

mario.generate_inventory()
# mario.display(2)

@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        pass
    elif request.method == 'GET':
        return render_template('index.html', items = mario.stock)

@app.route('/delete/<int:id>')
def delete(id):
    try:
        return redirect('/')
    except:
        return 'There was a problem deleting that task'

@app.route('/update/<int:id>', methods=['GET', 'POST'])
def update(id):
    if request.method == 'POST':
        try:
            return redirect('/')
        except:
            return 'There was an issue updating your task'

    else:
        pass

if __name__ == "__main__":
    app.run(debug=True)
