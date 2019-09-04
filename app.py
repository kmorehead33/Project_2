import os
import pandas as pd
import numpy as np 
import pymongo
from flask import Flask, render_template, jsonify

app = Flask(__name__)

conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

@app.route("/")
def index():
    """Return the homepage."""

    return render_template("index.html")

@app.route("/data")
def names():
    db = client.baseball_db
    collection = db.stats
    cursor = collection.find({})
    teams = []
    for team in cursor:
        newTeam = {'year': team['year'], 'team':team['team'], 'wins':team['wins'], 'losses':team['losses'], 'championship': team['championship'], 'attendance': team['attendance'], 'salary':team['salary']}
        teams.append(newTeam)
    cursor.close()
    return jsonify(teams)

if __name__ == "__main__":
    app.run(debug=True)