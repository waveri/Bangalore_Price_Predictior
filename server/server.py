from flask import Flask, request, jsonify
import util

app = Flask(__name__)

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
    print('Starting Python Flask Server For Home Price Prediction...')
    # --- THIS IS THE CRITICAL FIX ---
    # Load the model and location artifacts before running the app
    util.load_saved_artifacts()
    # --------------------------------
    app.run()
