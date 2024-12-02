import time
import threading
import requests
from flask import Flask, render_template, jsonify
from datetime import datetime, timedelta


app = Flask(__name__)

# Your API key and location
API_KEY = "e2a14997ca28418cb8c105717241311"
LOCATION = "35.166668,129.066666"  # Example coordinates (latitude,longitude)
BASE_URL = "https://api.weatherapi.com/v1"

# Data to store the current and historical weather values
current_weather = {
    "temp_c": 0,
    "humidity": 0
}

hourly_data = {
    "times": [],
    "temps": [],
    "humidity": []
}

seven_day_data = {
    "dates": [],
    "temps": [],
    "humidity": []
}

def get_weather_data():
    """Function to fetch the latest weather data from the API"""
    try:
        # Fetch current weather
        response = requests.get(f"{BASE_URL}/current.json", params={
            "key": API_KEY,
            "q": LOCATION
        })
        data = response.json()
        current_weather["temp_c"] = data["current"]["temp_c"]
        current_weather["humidity"] = data["current"]["humidity"]

        # Fetch hourly data for today
        hourly_response = requests.get(f"{BASE_URL}/history.json", params={
            "key": API_KEY,
            "q": LOCATION,
            "dt": time.strftime("%Y-%m-%d")
        })
        hourly_data_response = hourly_response.json()
        hourly_data["times"] = [hour["time"] for hour in hourly_data_response["forecast"]["forecastday"][0]["hour"]]
        hourly_data["temps"] = [hour["temp_c"] for hour in hourly_data_response["forecast"]["forecastday"][0]["hour"]]
        hourly_data["humidity"] = [hour["humidity"] for hour in hourly_data_response["forecast"]["forecastday"][0]["hour"]]

        seven_day_response = requests.get(f"{BASE_URL}/history.json", params={
            "key": API_KEY,
            "q": LOCATION,
            "dt": (datetime.now() - timedelta(days=6)).strftime('%Y-%m-%d'), 
            "end_dt": datetime.now().strftime('%Y-%m-%d')                     
        })

        seven_day_data_response = seven_day_response.json()

        # Extracting data for each day in the 7-day forecast
        seven_day_data["dates"] = [day["date"] for day in seven_day_data_response["forecast"]["forecastday"]]
        seven_day_data["temps"] = [day["day"]["avgtemp_c"] for day in seven_day_data_response["forecast"]["forecastday"]]
        seven_day_data["humidity"] = [day["day"]["avghumidity"] for day in seven_day_data_response["forecast"]["forecastday"]]

    except Exception as e:
        print(f"Error fetching weather data: {e}")

def update_weather_periodically():
    """Update the weather data every 10 minutes"""
    while True:
        get_weather_data()
        time.sleep(600)  # Wait for 10 minutes before fetching the data again

# Start the background thread to update the weather data every 10 minutes
weather_thread = threading.Thread(target=update_weather_periodically)
weather_thread.daemon = True
weather_thread.start()

@app.route("/")
def index():
    """Route for rendering the main page"""
    return render_template("homepage_test.html")

@app.route("/weather_data")
def weather_data():
    """API route to return the current weather data"""
    return jsonify(current_weather)

@app.route("/hourly_data")
def hourly_data_route():
    """API route to return hourly weather data"""
    return jsonify(hourly_data)

@app.route("/seven_day_data")
def seven_day_data_route():
    """API route to return 7-day average weather data"""
    return jsonify(seven_day_data)

if __name__ == "__main__":
    app.run(debug=True)
