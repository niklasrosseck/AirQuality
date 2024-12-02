import sqlite3

db_path = r'C:\Users\spiel\AirQuality\database\cities.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("PRAGMA table_info(cities);")
columns = cursor.fetchall()
print("Columns in the 'cities' table:", columns)

cursor.execute("SELECT * FROM cities LIMIT 5;")
rows = cursor.fetchall()
print("First 5 rows in 'cities' table:", rows)

conn.close()