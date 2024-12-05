from flask import jsonify, render_template, request
from services.weather_service import get_hourly_data, get_seven_day_data, get_weather_data, update_coordinates
from services.pollution_service import get_pollution_data, get_forecast_pollution, get_historical_pollution, get_7day_pollution, update_poll_coordinates
import traceback
import sqlite3


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


        
