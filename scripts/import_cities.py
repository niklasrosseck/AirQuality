# This function was used to create the database with the selected columns from the CSV file
# The csv file was deleted at the end because it was nearly 1GB 
import sqlite3
import pandas as pd
import os

df = pd.read_csv("geonames.csv", usecols=['name', 'asciiname', 'alternatenames', 'latitude', 'longitude', 'country code'])

database_folder = r'C:\Users\spiel\AirQuality\database' 
os.makedirs(database_folder, exist_ok=True) 

db_path = os.path.join(database_folder, 'cities.db') 

conn = sqlite3.connect(db_path)  
cursor = conn.cursor()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS cities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        country_name TEXT,
        ascii_name TEXT,
        alternate_names TEXT,
        latitude REAL,
        longitude REAL
    )
''')

for index, row in df.iterrows():
        
        cursor.execute('''
            INSERT INTO cities (name, country_name, ascii_name, alternate_names, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (row['name'], row['country code'], row['asciiname'], row['alternatenames'], row['latitude'], row['longitude']))

conn.commit()
conn.close()

os.remove("geonames.csv")