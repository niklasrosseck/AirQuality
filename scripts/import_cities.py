import sqlite3
import pandas as pd
import os

# Load the CSV using pandas, selecting only the required columns
df = pd.read_csv("geonames.csv", usecols=['name', 'asciiname', 'alternatenames', 'latitude', 'longitude', 'country code'])

# Define the path to save the database inside the database folder
database_folder = r'C:\Users\spiel\AirQuality\database' 
os.makedirs(database_folder, exist_ok=True) 

db_path = os.path.join(database_folder, 'cities.db') 

# Connect to SQLite (it will create the file if it doesn't exist)
conn = sqlite3.connect(db_path)  
cursor = conn.cursor()

# Create table (if not exists)
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
        
        # Insert data into SQLite
        cursor.execute('''
            INSERT INTO cities (name, country_name, ascii_name, alternate_names, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (row['name'], row['country code'], row['asciiname'], row['alternatenames'], row['latitude'], row['longitude']))

conn.commit()
conn.close()

os.remove("geonames.csv")