# This function fetches data every 10 minutes from the API and appends the csv file
# To prevent the csv file from getting too big the entries are limited to 10 000
# Newer entries are preferred so older entries are removed when the limit is reached

import os
import time
import requests
import pandas as pd
from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask

app = Flask(__name__)


DATA_PATH = './static/data/real_time_co2_data.csv'

url = "https://recoglass.net/api/get.php?key=SPXEGN1TGSB2IKT9&merge=10min&ls=0&le=5000&ext=json"
max_entries = 10000

def fetch_data():
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        df = pd.DataFrame(data)

        df.drop_duplicates(inplace=True)

        if os.path.exists(DATA_PATH):
            existing_df = pd.read_csv(DATA_PATH)

            last_timestamp = existing_df['datetime'].max() if 'datetime' in existing_df.columns else None

            if last_timestamp:
                df = df[df['datetime'] > last_timestamp]

            new_df = pd.concat([df, existing_df])
            if len(new_df) > max_entries:
                new_df = new_df.tail(max_entries)

            new_df.to_csv(DATA_PATH, index=False)
        else:
            df.to_csv(DATA_PATH, index=False)

        print(f"Data fetched and saved at {time.ctime()}")
    except Exception as e:
        print(f"Error fetching data: {e}")

scheduler = BackgroundScheduler()
scheduler.add_job(fetch_data, 'interval', minutes=10)
scheduler.start()


if __name__ == '__main__':
    try:
        app.run(debug=True)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
