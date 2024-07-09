from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database connection parameters
host = 'localhost'
dbname = 'mydb'
user = 'postgres'
password = '123'

@app.route('/save_feature', methods=['POST'])
def save_feature():
    try:
        # Connect to PostgreSQL database
        conn = psycopg2.connect(host=host, dbname=dbname, user=user, password=password)
        cursor = conn.cursor()

        # Get geometry and name from request JSON
        data = request.get_json()
        geometry = data.get('geometry')
        name = data.get('name')
        dist = data.get('distText')

        # Prepare SQL statement to insert GeoJSON geometry into PostgreSQL
        sql = "INSERT INTO features (name, dist, geometry) VALUES (%s, %s, ST_SetSRID(ST_GeomFromGeoJSON(%s), 4326))"
        cursor.execute(sql, (name, dist, geometry))

        # Commit the transaction
        conn.commit()

        # Close database connections
        cursor.close()
        conn.close()

        # Send response back to client (success message)
        return jsonify({name: " saved successfully."}), 200

    except psycopg2.Error as e:
        # Handle database errors
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)