# Moneyball:
Analyzing the Impact of Major League Baseball salaries on team succes.


<b>File Structure</b>
<li> Data: CSV files used for analysis.
<li> python: Python code to initialize MongoDB
<li> static: JavaScript code for graphs
<li> templates: HTML template
<li> app.py: FLASK app


<b>Project History</b>

<i>Data Gathering & Cleaning</i>
<li> Historical data CSV's imported from Kaggle.com.
<li> Salary data began in 1985, so that is where our analyis begins.
<li> Using pandas, the data was cleaned to give a sum total of each teams yearly salary, as well as their wins, losses, home attendance, and whether or not that team won the World Series. These were our markers of succcess.
<li> Cleaned dataframe converted into JSON and uploaded into MongoDB.
<br></br>

<i>FLASK App Creation</i>
<li> Used FLASK APP to connect to MongoDB.
<li> Created app routes for every combination of team and year in database.
<br></br>

<i>Data Visulization</i>
<li> Using JavaScript, we created a dynamic webpage that updates graphs displaying success vs. salary for any team in any given year using D3.
<li> Dropdown display created to show statistics for each team in any given year.
