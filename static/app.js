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
    var team = $('#teamSelector').val();
    var year = $('#yearSelector').val();
    //alert(`redrawing... ${team} ${year}`)

    function buildTeamData(team, year) {
        // @TODO: Complete the following function that builds the metadata panel

        // Use `d3.json` to fetch the metadata for a sample
        var teamDataUrl = `/team/${team}/year/${year}`;
        // Use d3 to select the panel with id of `#sample-metadata`
        d3.json(teamDataUrl).then(function(teamRow) {
            var teamData = d3.select('#team-data');
            console.log(teamRow);
            // Use `.html("") to clear any existing metadata
            teamData.html('');
            // Use `Object.entries` to add each key and value pair to the panel
            // Hint: Inside the loop, you will need to use d3 to append new
            // tags for each key-value in the metadata.
            Object.entries(teamRow[0] ? teamRow[0] : { data: 'not available' }).forEach(function([key, value]) {
                var row = teamData.append('p');
                row.text(`${key}:${value}`);
                console.log(JSON.stringify(`${key}:${value}`));
            });
        });
    }

    buildTeamData(team, year);
    drawBarChart(team, year);
}

function drawBarChart(team, year) {
    var teamDataUrl = `/year/${year}`;

    var svg = d3.select('svg'),
        margin = { top: 20, right: 20, bottom: 30, left: 100 },
        width = +svg.attr('width') - margin.left - margin.right,
        height = +svg.attr('height') - margin.top - margin.bottom,
        x = d3
            .scaleBand()
            .rangeRound([0, width])
            .padding(0.2),
        y = d3.scaleLinear().rangeRound([height, 0]),
        g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    console.log(width);
    console.log(height);

    d3.json(teamDataUrl).then(data => {
        console.log(data);

        var xdomain = [];
        data.forEach(x => xdomain.push(x.team));
        x.domain(xdomain);
        y.domain([0, d3.max(data, d => d.salary)]);
        console.log(x.domain());
        console.log(y.domain());

        g.append('g')
            .attr('class', 'axis axis-x')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append('g')
            .attr('class', 'axis axis-y')
            .call(d3.axisLeft(y));

        g.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.team))
            .attr('y', d => y(d.salary))
            .attr('width', 25)
            .attr('height', d => height - y(d.salary));
    });
}
