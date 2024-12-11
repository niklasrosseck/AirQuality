import time
import threading
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("WEATHERAPI_API_KEY")
current_coordinates = {"latitude": 35.1796, "longitude": 129.0756} 
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

def get_weather_data(latitude, longitude):
    try:
        response = requests.get(f"{BASE_URL}/current.json", params={
            "key": API_KEY,
            "q": f"{latitude},{longitude}"
        })
        data = response.json()
        current_weather["temp_c"] = data["current"]["temp_c"]
        current_weather["humidity"] = data["current"]["humidity"]

        return current_weather

    except Exception as e:
        print(f"Error fetching weather data: {e}")

def get_hourly_data(latitude, longitude):
    try:
        hourly_response = requests.get(f"{BASE_URL}/history.json", params={
            "key": API_KEY,
            "q": f"{latitude},{longitude}",
            "dt": time.strftime("%Y-%m-%d")
        })
        hourly_data_response = hourly_response.json()
        hourly_data["times"] = [hour["time"] for hour in hourly_data_response["forecast"]["forecastday"][0]["hour"]]
        hourly_data["temps"] = [hour["temp_c"] for hour in hourly_data_response["forecast"]["forecastday"][0]["hour"]]
        hourly_data["humidity"] = [hour["humidity"] for hour in hourly_data_response["forecast"]["forecastday"][0]["hour"]]

        return hourly_data
    
    except Exception as e:
        print(f"Error fetching weather data: {e}")

def get_seven_day_data(latitude, longitude):
    try:
        seven_day_response = requests.get(f"{BASE_URL}/history.json", params={
            "key": API_KEY,
            "q": f"{latitude},{longitude}",
            "dt": (datetime.now() - timedelta(days=6)).strftime('%Y-%m-%d'), 
            "end_dt": datetime.now().strftime('%Y-%m-%d')                     
        })

        seven_day_data_response = seven_day_response.json()

        # Extracting data for each day in the 7-day forecast
        seven_day_data["dates"] = [day["date"] for day in seven_day_data_response["forecast"]["forecastday"]]
        seven_day_data["temps"] = [day["day"]["avgtemp_c"] for day in seven_day_data_response["forecast"]["forecastday"]]
        seven_day_data["humidity"] = [day["day"]["avghumidity"] for day in seven_day_data_response["forecast"]["forecastday"]]

        return seven_day_data
    
    except Exception as e:
        print(f"Error fetching weather data: {e}")


def update_weather_periodically():
    """Update the weather data every 10 minutes"""
    while True:
        latitude = current_coordinates["latitude"]
        longitude = current_coordinates["longitude"]

        get_weather_data(latitude, longitude)
        get_hourly_data(latitude, longitude)
        get_seven_day_data(latitude, longitude)
        time.sleep(600)

def update_coordinates(lat, lon):
    current_coordinates["latitude"] = lat
    current_coordinates["longitude"] = lon

weather_thread = threading.Thread(target=update_weather_periodically)
weather_thread.daemon = True
weather_thread.start()