import time
import threading
import requests
from datetime import datetime, timedelta

API_KEY = "fd488f47838f7b8ad07a3418c68837ce"
LATITUDE = "35.166668"
LONGITUDE = "129.066666"
BASE_URL = "https://api.openweathermap.org/data/2.5/air_pollution"

current_pollution = {
    "pm2_5": 0,
    "pm10": 0,
    "co": 0,
    "no2": 0,
    "nh3": 0,
    "so2": 0,
    "o3": 0
}

def get_pollution_data():
    try:
        response = requests.get(BASE_URL, params={
            "lat": LATITUDE,
            "lon": LONGITUDE,
            "appid": API_KEY
        })
        response.raise_for_status()  # Raise exception for HTTP errors

        data = response.json()
        components = data["list"][0]["components"]

        current_pollution["pm2_5"] = components["pm2_5"]
        current_pollution["pm10"] = components["pm10"]
        current_pollution["co"] = components["co"]
        current_pollution["no2"] = components["no2"]
        current_pollution["nh3"] = components["nh3"]
        current_pollution["so2"] = components["so2"]
        current_pollution["o3"] = components["o3"]

        return current_pollution

    except requests.exceptions.RequestException as e:
        print(f"Error fetching pollution data: {e}")


def get_forecast_pollution():
    try:
        response = requests.get(f"{BASE_URL}/forecast", params={
            "lat": LATITUDE,
            "lon": LONGITUDE,
            "appid": API_KEY
        })
        response.raise_for_status()
        forecast_data = response.json()

        now = datetime.now()
        tomorrow = now + timedelta(days=1)

        hourly_tomorrow = [
            item for item in forecast_data["list"]
            if datetime.utcfromtimestamp(item["dt"]).date() == tomorrow.date()
        ]

        def calculate_average(component):
            return round(sum(item["components"][component] for item in hourly_tomorrow) / len(hourly_tomorrow), 2)

        avg_pollution = {
            "avg_pm2_5": calculate_average("pm2_5"),
            "avg_pm10": calculate_average("pm10"),
            "avg_no2": calculate_average("no2"),
            "avg_nh3": calculate_average("nh3"),
            "avg_co": calculate_average("co"),
            "avg_so2": calculate_average("so2"),
            "avg_o3": calculate_average("o3")
        }

        hourly_data = [
            {
                "time": item["dt"],
                "pm2_5": item["components"]["pm2_5"],
                "pm10": item["components"]["pm10"],
                "no2": item["components"]["no2"],
                "nh3": item["components"]["nh3"],
                "co": item["components"]["co"],
                "so2": item["components"]["so2"],
                "o3": item["components"]["o3"]
            }
            for item in hourly_tomorrow
        ]

        return hourly_data, avg_pollution  

    except requests.exceptions.RequestException as e:
        print(f"Error fetching forecast pollution data: {e}")
        return None, None

def get_historical_pollution():
    try: 
        now = datetime.now()
        yesterday_start = int((now - timedelta(days=1)).replace(hour=0, minute=0, second=0).timestamp())
        yesterday_end = int((now - timedelta(days=1)).replace(hour=23, minute=59, second=59).timestamp())

        response = requests.get(f"{BASE_URL}/history", params={
            "lat": LATITUDE,
            "lon": LONGITUDE,
            "appid": API_KEY,
            "start": yesterday_start,
            "end": yesterday_end
        })
        response.raise_for_status()
        history_data = response.json()
        hourly_yesterday = history_data.get("list", [])

        def calculate_average(component):
            values = [item["components"][component] for item in hourly_yesterday if component in item["components"]]
            return round(sum(values) / len(values), 2) if values else 0
        
        avg_pollution_yesterday = {
            "avg_pm2_5": calculate_average("pm2_5"),
            "avg_pm10": calculate_average("pm10"),
            "avg_no2": calculate_average("no2"),
            "avg_nh3": calculate_average("nh3"),
            "avg_co": calculate_average("co"),
            "avg_so2": calculate_average("so2"),
            "avg_o3": calculate_average("o3")
        }

        return avg_pollution_yesterday

    except requests.exceptions.RequestException as e:
        print(f"Error fetching history pollution data: {e}")
        return None, None
    
def get_7day_pollution():
    try:
        end = int(datetime.now().timestamp())
        start = end - 7 * 24 * 60 * 60 

        response = requests.get(f"{BASE_URL}/history", params={
            "lat": LATITUDE,
            "lon": LONGITUDE,
            "start": start,
            "end": end,
            "appid": API_KEY
        })

        response.raise_for_status()
        history_data = response.json()

        historical_data = [
            {
                "time": datetime.utcfromtimestamp(item["dt"]).strftime('%Y-%m-%d %H:%M:%S'),
                "pm2_5": item["components"]["pm2_5"],
                "pm10": item["components"]["pm10"],
                "no2": item["components"]["no2"],
                "nh3": item["components"]["nh3"],
                "co": item["components"]["co"],
                "so2": item["components"]["so2"],
                "o3": item["components"]["o3"]
            }
            for item in history_data.get("list", [])
        ]

        def calculate_average(component):
            values = [item[component] for item in historical_data if component in item]
            return round(sum(values) / len(values), 2) if values else 0

        avg_pollution = {
            "avg_pm2_5": calculate_average("pm2_5"),
            "avg_pm10": calculate_average("pm10"),
            "avg_no2": calculate_average("no2"),
            "avg_nh3": calculate_average("nh3"),
            "avg_co": calculate_average("co"),
            "avg_so2": calculate_average("so2"),
            "avg_o3": calculate_average("o3"),
        }

        return historical_data, avg_pollution

    except requests.exceptions.RequestException as e:
        print(f"Error fetching 7 day history pollution data: {e}")
        return None, None

def update_pollution_periodically():
    while True:
        get_pollution_data()
        get_forecast_pollution()
        get_historical_pollution()
        get_7day_pollution()
        time.sleep(600)  

pollution_thread = threading.Thread(target=update_pollution_periodically)
pollution_thread.daemon = True 
pollution_thread.start()
