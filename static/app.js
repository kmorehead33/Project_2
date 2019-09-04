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
}