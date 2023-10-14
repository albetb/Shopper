from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

@app.route('/api/')
def index():
    return jsonify(message="E")

if __name__ == '__main__':
    app.run(debug=True)
