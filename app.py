import os
import pandas as pd
import numpy as np 
import pymongo
from flask import Flask, render_template, jsonify

app = Flask(__name__)

conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

db = client.baseball_db
collection = db.stats

@app.route("/")
def index():
    """Return the homepage."""

    return render_template("index.html")

@app.route("/data")
def names():
    for team in collection:
        print('{0} {1}'.format(team['year'], 
            team['team']))

if __name__ == "__main__":
    app.run(debug=True)