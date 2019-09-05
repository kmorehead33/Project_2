import os
import pandas as pd
import numpy as np 
import pymongo
from pymongo import MongoClient
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
    db = client.baseball_db
    collection = db.stats
    cursor = collection.find({})
    teams = []
    for team in cursor:
        newTeam = {'year': team['year'], 'team':team['team'], 'wins':team['wins'], 'losses':team['losses'], 'championship': team['championship'], 'attendance': team['attendance'], 'salary':team['salary']}
        teams.append(newTeam)
    cursor.close()
    return jsonify(teams)

@app.route("/year/<year>")
def years(year):
    db = client.baseball_db
    collection = db.stats
    year_cursor = collection.find({"year": int(year)})
    year_dict = []
    for year in year_cursor:
        selected_year = {'year': year['year'], 'team':year['team'], 'wins':year['wins'], 'losses':year['losses'], 'championship': year['championship'], 'attendance': year['attendance'], 'salary':year['salary']}
        year_dict.append(selected_year)
    year_cursor.close()
    return jsonify(year_dict)

@app.route("/team/<team>")
def teams(team):
    db = client.baseball_db
    collection = db.stats
    team_cursor = collection.find({"team": team})
    team_dict = []
    for team in team_cursor:
        selected_team = {'year': team['year'], 'team':team['team'], 'wins':team['wins'], 'losses':team['losses'], 'championship': team['championship'], 'attendance': team['attendance'], 'salary':team['salary']}
        team_dict.append(selected_team)
    team_cursor.close()
    return jsonify(team_dict)

@app.route("/team/<team>/year/<year>")
def teams_year(team, year):
    db = client.baseball_db
    collection = db.stats
    team_cursor = collection.find({"team": team})
    team_dict = []
    for teamRow in team_cursor:
        if (int(year) == teamRow['year']):
            selected_team = {'year': teamRow['year'], 'team':teamRow['team'], 'wins':teamRow['wins'], 'losses':teamRow['losses'], 'championship': teamRow['championship'], 'attendance': teamRow['attendance'], 'salary':teamRow['salary']}
            team_dict.append(selected_team)
    team_cursor.close()
    print(team_dict)
    return jsonify(team_dict)

if __name__ == "__main__":
    app.run(debug=True)