function SalaryGraph() {
    // https://www.d3-graph-gallery.com/
    
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
        .select('#salary-vs-wins')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //Read the data
    d3.csv('/Salaries.csv', function(data) {
        // Add X axis
        var x = d3
            .scaleLinear()
            .domain([1980, 2020])
            .range([0, width]);
        svg.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3
            .scaleLinear()
            .domain([0, 2000000])
            .range([height, 0]);
        svg.append('g').call(d3.axisLeft(y));

        // Add dots
        svg.append('g')
            .selectAll('dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', function(d) {
                return x(d.yearID);
            })
            .attr('cy', function(d) {
                return y(d.salary);
            })
            .attr('r', 1.5)
            .style('fill', '#69b3a2');
    });
}

SalaryGraph();

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
            .attr('width', 20)
            .attr('height', d => height - y(d.salary));
    });