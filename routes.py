# Here are all routes from the whole website
# Every data and its path that needs to be accessed is defined here

from flask import jsonify, render_template, request, send_from_directory, send_file
from services.weather_service import get_hourly_data, get_seven_day_data, get_weather_data, update_coordinates
from services.pollution_service import get_pollution_data, get_forecast_pollution, get_historical_pollution, get_7day_pollution, update_poll_coordinates
from services.weather_dashboard import get_weather_api_data, update_weather_coordinates
from services.ai_predict import load_data, preprocess_data, predict
import traceback
import sqlite3
import json
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler

MODEL_PATHS = {
    "gru": "./models/model_gru.keras",
    "lstm": "./models/model_lstm.keras",
    "bilstm": "./models/model_bi.keras",
    "cnn_lstm": "./models/model_cnn.keras",
    "deeplstm": "./models/model_deep.keras",
}

CSV_FILE = './static/data/real_time_co2_data.csv'


def register_routes(app):
    @app.route("/")
    def index():
        return render_template("homepage_test.html")
    
    @app.route("/privacy")
    def privacy():
        return render_template("privacy.html")
    
    @app.route("/contact")
    def contact():
        return render_template("contact.html")
    
    @app.route("/weather")
    def weather():
        return render_template("weather.html")
    
    @app.route("/ai")
    def ai():
        return render_template("AI.html")
    
    @app.route("/weather_data")
    def weather_data():
        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')

        if latitude is not None and longitude is not None:
            update_coordinates(latitude, longitude)

        data = get_weather_data(latitude, longitude)
        return jsonify(data)

    @app.route('/hourly_data')
    def hourly_data():
        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')

        if latitude is not None and longitude is not None:
            update_coordinates(latitude, longitude)

        data = get_hourly_data(latitude, longitude)
        return jsonify(data)

    @app.route('/seven_day_data')
    def seven_day_data():
        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')

        if latitude is not None and longitude is not None:
            update_coordinates(latitude, longitude)

        data = get_seven_day_data(latitude, longitude)
        return jsonify(data)
    
    @app.route("/pollution_data")
    def pollution_data():
        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')

        if latitude is not None and longitude is not None:
            update_poll_coordinates(latitude, longitude)

        data = get_pollution_data(latitude, longitude)
        return jsonify(data)
    
    @app.route("/forecast_pollution")
    def forecast_pollution():
        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')

        if latitude is not None and longitude is not None:
            update_poll_coordinates(latitude, longitude)

        hourly_data, avg_pollution = get_forecast_pollution(latitude, longitude)
    
        if hourly_data and avg_pollution:
            return jsonify({
                "hourly_data": hourly_data,
                "avg_pollution": avg_pollution
            })
        else:
            return jsonify({"error": "Error fetching pollution data"}), 500
    
    @app.route("/historical_pollution")
    def historical_pollution():
        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')

        if latitude is not None and longitude is not None:
            update_poll_coordinates(latitude, longitude)

        data = get_historical_pollution(latitude, longitude)
        return jsonify(data)
    
    @app.route("/historical_7day_pollution")
    def historical_7day_pollution():
        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')

        if latitude is not None and longitude is not None:
            update_poll_coordinates(latitude, longitude)

        historical_data, avg_pollution = get_7day_pollution(latitude, longitude)
    
        if historical_data and avg_pollution:
            return jsonify({
                "historical_data": historical_data,
                "avg_pollution": avg_pollution
            })
        else:
            return jsonify({"error": "Error fetching pollution data"}), 500
    
    @app.route('/get-city-coordinates', methods=['GET'])
    def city_coordinates():
        city_name = request.args.get('city', '').strip()
        if not city_name:
            return jsonify({"error": "City name is required"}), 400

        try:
            conn = sqlite3.connect('./database/cities.db')
            cursor = conn.cursor()
        
            cursor.execute("""
                SELECT latitude, longitude 
                FROM cities 
                WHERE LOWER(name) = LOWER(?) 
                ORDER BY country_name 
                LIMIT 1
            """, (city_name,))
        
            row = cursor.fetchone()
            conn.close()

            if row:
                return jsonify({"latitude": row[0], "longitude": row[1]})
            else:
                return jsonify({"error": "City not found"}), 404
        except Exception as e:
            print("Error:", e)
            traceback.print_exc()
            return jsonify({"error": "Internal server error"}), 500
        
    @app.route('/get-city-suggestions', methods=['GET'])
    def city_suggestions():
        term = request.args.get('term', '').lower()  # Case-insensitive
        if not term:
            return jsonify([])

        try:
            conn = sqlite3.connect('./database/cities.db')
            cursor = conn.cursor()
            cursor.execute("""
                SELECT name, country_name 
                FROM cities 
                WHERE LOWER(name) LIKE ? 
                ORDER BY name ASC 
                LIMIT 10
            """, (f'%{term}%',))
        
            results = cursor.fetchall()
            conn.close()
        
            suggestions = [{"label": f"{name}, {country}", "value": name} for name, country in results]
            return jsonify(suggestions)
        except Exception as e:
            print("Error fetching suggestions:", e)
            traceback.print_exc()
            return jsonify([])
    
    @app.route("/weather_dashboard_data")
    def weather_dashboard_data():
        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')

        if latitude is not None and longitude is not None:
            update_weather_coordinates(latitude, longitude)

        data = get_weather_api_data(latitude, longitude)
        return jsonify(data)

    @app.route('/csv_data', methods=['GET'])
    def get_csv_data():
        return send_from_directory('static/data', 'real_time_co2_data.csv')

    @app.route('/predict_co2', methods=['POST'])
    def make_prediction():
        try:
            print(f"Received request data: {request.json}")

            model_name = request.json.get('model_name')
            if not model_name:
                return jsonify({'error': "Model name not provided."}), 400

            if model_name not in MODEL_PATHS:
                return jsonify({'error': f"Model '{model_name}' not found."}), 400
            

            df = pd.read_csv(CSV_FILE)

            df['datetime'] = pd.to_datetime(df['datetime'])
            df.set_index('datetime', inplace=True)

            features = ['Temperature', 'Pressure', 'Humidity', 'VoC', 'Altitude']
            target = ['CO2']

            feature_scaler = MinMaxScaler()
            df[features] = feature_scaler.fit_transform(df[features])
        
            target_scaler = MinMaxScaler()
            df[target] = target_scaler.fit_transform(df[target])

            def create_sequences(data, seq_len):
                X, y = [], []
                for i in range(len(data) - seq_len):
                    X.append(data[i:i + seq_len, :-1])  # Features
                    y.append(data[i + seq_len, -1])     # Target (CO2)
                return np.array(X), np.array(y)

            sequence_length = 96
            data = df[features + target].values
            X, y = create_sequences(data, sequence_length)

            predictions = predict(model_name, X)

            if len(predictions.shape) == 1:
                predictions = predictions.reshape(-1, 1)

            predictions_rescaled = target_scaler.inverse_transform(predictions.reshape(-1, 1))

            latest_prediction = float(predictions_rescaled[-1][0])
            rounded_prediction = round(latest_prediction, 2)

            if rounded_prediction < 400:
                co2_category = "Low"
            elif 400 <= latest_prediction < 600:
                co2_category = "Medium"
            elif 600 <= latest_prediction < 900:
                co2_category = "High"
            else:
                co2_category = "Very High"

            return jsonify({'model': model_name, 'predicted_co2': rounded_prediction, 'co2_category': co2_category})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        
    
    @app.route('/get_loss_data/<model_name>', methods=['GET'])
    def get_co2_loss_data(model_name):
        try:
            filepath = f'static/data/{model_name}/loss_data_{model_name}.json'
            with open(filepath, 'r') as f:
                loss_data = json.load(f)
            return jsonify(loss_data)
        except FileNotFoundError:
            return jsonify({"error": f"Loss data for model '{model_name}' not found."}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/get_predictions/<model_name>', methods=['GET'])
    def get_co2_predictions(model_name):
        try:
            filepath = f'static/data/{model_name}/predictions_vs_actual_{model_name}.csv'
            return send_file(filepath, as_attachment=True)
        except FileNotFoundError:
            return jsonify({"error": f"Prediction data for model '{model_name}' not found."}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500

        
