from flask import Flask, request, jsonify
import util
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

util.load_saved_artifacts() #force calling util.py  -> load_artifacts()

@app.route('/')
def home():
    return "Welcome to the Bangalore Home Price Prediction API!"
    
@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    response = jsonify({
        'locations': util.get_location_names()
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    try:
        # Get data from the form
        total_sqft = float(request.form['total_sqft'])
        location = request.form['location']  # This is a string, not a float
        bhk = int(request.form['bhk'])
        bath = int(request.form['bath'])

        # Get the estimated price from util.py
        estimated_price = util.get_estimated_price(location, total_sqft, bhk, bath)

        response = jsonify({
            'estimated_price': estimated_price
        })
    except Exception as e:
        print(f"Error during prediction: {e}")
        response = jsonify({
            'error': 'Error predicting price. Check server logs.'
        }), 500 # Internal Server Error

    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == "__main__":
    #gunicorn is gonna ignore this if block, as we are runing on Render which uses gunicorn server not our local pc server.
    print('Starting Python Flask Server For Home Price Prediction...')
    util.load_saved_artifacts()
    app.run()
