import psycopg2
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/data', methods=['GET'])
def get_data():
    conn = psycopg2.connect(host='localhost', user='postgres', password='123', dbname='froms', port=5432)
    curs = conn.cursor()
    curs.execute("SELECT * FROM data")
    data = curs.fetchall()
    conn.commit()
    curs.close()
    conn.close()
    return jsonify(data)

@app.route('/add', methods=['POST'])
def add_data():
    fname = request.form.get("name")
    lname = request.form.get("lname")
    age = request.form.get("age")
    add = request.form.get("address")
    sub = request.form.get("subject")

    conn = psycopg2.connect(host='localhost', user='postgres', password='123', dbname='froms', port=5432)
    curs = conn.cursor()

    sql = "INSERT INTO data(name, lname, age, address, subject) VALUES (%s, %s, %s, %s, %s)"
    curs.execute(sql, (fname, lname, age, add, sub))

    conn.commit()
    curs.close()
    conn.close()

    return jsonify({"message": "Data added successfully"})

if __name__ == '__main__':
    app.run(debug=True)
