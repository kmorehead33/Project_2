var teamData;
$.getJSON('/data', function (data) {
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


    function buildTeamData(team, year) {

        var teamDataUrl = `/team/${team}/year/${year}`;

        d3.json(teamDataUrl).then(function (teamRow) {
            var teamData = d3.select('#team-data');
            console.log(teamRow);

            teamData.html('');

            Object.entries(teamRow[0] ? teamRow[0] : { data: 'not available' }).forEach(function ([key, value]) {
                var row = teamData.append('p');
                row.text(`${key}:${value}`);
                console.log(JSON.stringify(`${key}:${value}`));
            });
        });
    }

    buildTeamData(team, year);
    drawBarChart(team, year);
    drawWinScatter(team, year);
    drawWinAttendance(team, year);
}

function drawBarChart(team, year) {
    var teamDataUrl = `/year/${year}`;
    var svgWidth = 960;
    var svgHeight = 660;


    var margin = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30
    };


    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    document.getElementById("team-salary").innerHTML = "";
    var svg = d3.select("#team-salary")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);


    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


    d3.json(teamDataUrl).then(function (teamData) {
        {

            console.log(teamData);


            teamData.forEach(function (d) {
                d.salary = +d.salary;
            });


            var xBandScale = d3.scaleBand()
                .domain(teamData.map(d => d.team))
                .range([0, width])
                .padding(0.1);


            var yLinearScale = d3.scaleLinear()
                .domain([0, d3.max(teamData, d => d.salary)])
                .range([height, 0]);


            var bottomAxis = d3.axisBottom(xBandScale);
            var leftAxis = d3.axisLeft(yLinearScale).ticks(10);


            chartGroup.append("g")
                .call(leftAxis);

            chartGroup.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(bottomAxis);


            chartGroup.selectAll(".bar")
                .data(teamData)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", d => xBandScale(d.team))
                .attr("y", d => yLinearScale(d.salary))
                .attr("width", xBandScale.bandwidth())
                .attr("height", d => height - yLinearScale(d.salary));

            chartGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left + 40)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .attr("class", "axisText")
                .text("Salary");

            chartGroup.append("text")
                .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
                .attr("class", "axisText")
                .text("Team");

        };

    });

}

function drawWinScatter(team, year) {
    var teamDataUrl = `/year/${year}`;
    var svgWidth = 500;
    var svgHeight = 500;

    var margin = {
        top: 20,
        right: 40,
        bottom: 60,
        left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    document.getElementById("win-salary").innerHTML = "";
    var svg = d3.select("#win-salary")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.json(teamDataUrl)
        .then(function (teamData) {
            teamData.forEach(function (data) {
                data.wins = +data.wins;
                data.salary = +data.salary;
            });

            var xLinearScale = d3.scaleLinear()
                .domain([20, d3.max(teamData, d => d.wins)])
                .range([0, width]);
            var yLinearScale = d3.scaleLinear()
                .domain([0, d3.max(teamData, d => d.salary)])
                .range([height, 0]);

            var bottomAxis = d3.axisBottom(xLinearScale);
            var leftAxis = d3.axisLeft(yLinearScale);

            chartGroup.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(bottomAxis);

            chartGroup.append("g")
                .call(leftAxis);

            var circlesGroup = chartGroup.selectAll("circle")
                .data(teamData)
                .enter()
                .append("circle")
                .attr("cx", d => xLinearScale(d.wins))
                .attr("cy", d => yLinearScale(d.salary))
                .attr("r", "15")
                .attr("fill", "pink")
                .attr("opacity", ".5");

            chartGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left + 40)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .attr("class", "axisText")
                .text("Salary");

            chartGroup.append("text")
                .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
                .attr("class", "axisText")
                .text("Wins");


        });
}

function drawWinAttendance(team, year) {
    var teamDataUrl = `/year/${year}`;
    var svgWidth = 500;
    var svgHeight = 500;

    var margin = {
        top: 20,
        right: 40,
        bottom: 60,
        left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    document.getElementById("attendance-salary").innerHTML = "";
    var svg = d3.select("#attendance-salary")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.json(teamDataUrl)
        .then(function (teamData) {
            teamData.forEach(function (data) {
                data.attendance = +data.attendance;
                data.salary = +data.salary;
            });

            var xLinearScale = d3.scaleLinear()
                .domain([20, d3.max(teamData, d => d.attendance)])
                .range([0, width]);
            var yLinearScale = d3.scaleLinear()
                .domain([0, d3.max(teamData, d => d.salary)])
                .range([height, 0]);

            var bottomAxis = d3.axisBottom(xLinearScale);
            var leftAxis = d3.axisLeft(yLinearScale);

            chartGroup.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(bottomAxis);

            chartGroup.append("g")
                .call(leftAxis);

            var circlesGroup = chartGroup.selectAll("circle")
                .data(teamData)
                .enter()
                .append("circle")
                .attr("cx", d => xLinearScale(d.attendance))
                .attr("cy", d => yLinearScale(d.salary))
                .attr("r", "15")
                .attr("fill", "pink")
                .attr("opacity", ".5");

            chartGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left + 40)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .attr("class", "axisText")
                .text("Salary");

            chartGroup.append("text")
                .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
                .attr("class", "axisText")
                .text("Attendance");


        });
}