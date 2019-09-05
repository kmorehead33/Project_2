var teamData;
$.getJSON('/data', function(data) {
    teamData = data;
    createObjects();
    myRedraw();
});

function createObjects() {
    createTeamDropdown();
    createYearDropdown();
}

function createTeamDropdown() {
    var uniqueTeams = {};
    teamData.map(d => (uniqueTeams[d.team] = undefined));
    uniqueTeams = Object.entries(uniqueTeams);
    uniqueTeams = uniqueTeams.sort();
    var selector = '<select id="teamSelector" onchange="myRedraw()">';
    for (i = 0; i < uniqueTeams.length; i++) {
        selector += `<option>${uniqueTeams[i][0]}</option>`;
    }
    selector += '</select>';
    $('#teamDropdown').html(selector);
}
function createYearDropdown() {
    var uniqueYears = {};
    teamData.map(d => (uniqueYears[d.year] = undefined));
    uniqueYears = Object.entries(uniqueYears);
    uniqueYears = uniqueYears.sort();
    var selector = '<select id="yearSelector" onchange="myRedraw()">';
    for (i = 0; i < uniqueYears.length; i++) {
        selector += `<option>${uniqueYears[i][0]}</option>`;
    }
    selector += '</select>';
    $('#yearDropdown').html(selector);
}

function myRedraw() {
    var team =  $( "#teamSelector" ).val();
    var year = $( "#yearSelector" ).val();
    alert(`redrawing... ${team} ${year}`)

function buildTeamData(team, year) {

    // @TODO: Complete the following function that builds the metadata panel
    
    // Use `d3.json` to fetch the metadata for a sample
var teamDataUrl = `/team/${team}/year/${year}`
// Use d3 to select the panel with id of `#sample-metadata`
d3.json(teamDataUrl).then(function(team, year){
var teamData = d3.select("#team-data");

// Use `.html("") to clear any existing metadata
teamData.html("");
        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
Object.entries(team, year).forEach(function([key,value]){
    var row = teamData.append("p");
    row.text(`${key}:${value}`);
    console.log(JSON.stringify(`${key}:${value}`))

    });
    });
}

buildTeamData(team, year)
}

