import time
import threading
import requests

API_KEY = "456b134c5b814ff8b87aba85b8dc06c0"
current_weather_coordinates = {"latitude": 35.1796, "longitude": 129.0756}
BASE_URL = "https://api.weatherbit.io/v2.0/current"

current_weather_api = {
    "temp_c": 0,
    "humidity": 0,
    "sunrise": "",
    "sunset": "",
    "wind-speed": 0,
    "wind-direction": 0,
    "cloud-coverage": 0,
    "feels-like-temp": 0,
    "uv": 0,
    "weather-code": 0,
    "weather-description": "",
    "snow": 0,
    "solar-radiation": 0
}


def get_weather_api_data(latitude, longitude):
    try:
        response = requests.get(BASE_URL, params={
            "key": API_KEY,
            "lat": latitude,
            "lon": longitude
        })

        if response.status_code == 200:
            data = response.json()
            weather_data = data["data"][0] 

            current_weather_api["temp_c"] = weather_data.get("temp", 0)
            current_weather_api["humidity"] = weather_data.get("rh", 0)
            current_weather_api["sunrise"] = weather_data.get("sunrise", "")
            current_weather_api["sunset"] = weather_data.get("sunset", "")
            current_weather_api["wind-speed"] = weather_data.get("wind_spd", 0)
            current_weather_api["wind-direction"] = weather_data.get("wind_dir", 0)
            current_weather_api["cloud-coverage"] = weather_data.get("clouds", 0)
            current_weather_api["feels-like-temp"] = weather_data.get("app_temp", 0)
            current_weather_api["uv"] = weather_data.get("uv", 0)
            current_weather_api["weather-code"] = weather_data["weather"].get("code", 0)
            current_weather_api["weather-description"] = weather_data["weather"].get("description", "")
            current_weather_api["snow"] = weather_data.get("snow", 0)
            current_weather_api["solar-radiation"] = weather_data.get("solar_rad", 0)

            return current_weather_api
        else:
            print(f"Error: Received {response.status_code} from Weatherbit API.")
    except Exception as e:
        print(f"Error fetching weather data: {e}")
        return None


def update_weather_periodically():
    """Update the weather data every 10 minutes."""
    while True:
        latitude = current_weather_coordinates["latitude"]
        longitude = current_weather_coordinates["longitude"]
        print(f"Fetching weather data for coordinates: {latitude}, {longitude}")
        get_weather_api_data(latitude, longitude)
        time.sleep(600)  


def update_weather_coordinates(lat, lon):
    current_weather_coordinates["latitude"] = lat
    current_weather_coordinates["longitude"] = lon


weather_thread = threading.Thread(target=update_weather_periodically)
weather_thread.daemon = True
weather_thread.start()
