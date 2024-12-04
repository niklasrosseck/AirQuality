import sqlite3
import traceback

# Just for info
# Table: cities
# Columns: ['id', 'name', 'country_name', 'ascii_name', 'alternate_names', 'latitude', 'longitude']

def get_city_coordinates(city_name):
    try:
        conn = sqlite3.connect('./database/cities.db')  
        cursor = conn.cursor()
        
        cursor.execute("SELECT latitude, longitude FROM cities WHERE ascii_name = ? LIMIT 1", (city_name,))
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return {"latitude": row[0], "longitude": row[1]}
        else:
            return None
    except Exception as e:
        print("Error while querying the database:", e)
        traceback.print_exc()  
        return None
