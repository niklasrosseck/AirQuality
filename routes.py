from flask import jsonify, render_template
from services.weather_service import get_hourly_data, get_seven_day_data, get_weather_data
from services.pollution_service import get_pollution_data, get_forecast_pollution, get_historical_pollution, get_7day_pollution

def register_routes(app):
    @app.route("/")
    def index():
        return render_template("homepage_test.html")
    
    @app.route("/weather_data")
    def weather_data():
        data = get_weather_data()
        return jsonify(data)

    @app.route('/hourly_data')
    def hourly_data():
        data = get_hourly_data()
        return jsonify(data)

    @app.route('/seven_day_data')
    def seven_day_data():
        data = get_seven_day_data()
        return jsonify(data)
    
    @app.route("/pollution_data")
    def pollution_data():
        data = get_pollution_data()
        return jsonify(data)
    
    @app.route("/forecast_pollution")
    def forecast_pollution():
        hourly_data, avg_pollution = get_forecast_pollution()
    
        if hourly_data and avg_pollution:
            return jsonify({
                "hourly_data": hourly_data,
                "avg_pollution": avg_pollution
            })
        else:
            return jsonify({"error": "Error fetching pollution data"}), 500
    
    @app.route("/historical_pollution")
    def historical_pollution():
        data = get_historical_pollution()
        return jsonify(data)
    
    @app.route("/historical_7day_pollution")
    def historical_7day_pollution():
        historical_data, avg_pollution = get_7day_pollution()
    
        if historical_data and avg_pollution:
            return jsonify({
                "historical_data": historical_data,
                "avg_pollution": avg_pollution
            })
        else:
            return jsonify({"error": "Error fetching pollution data"}), 500
        
