var getData = function (data) {
    data.sort(function(a, b){
        var keyA = a.Neighborhood,
            keyB = b.Neighborhood;
        // Compare the 2 dates
        if(keyA < keyB) return -1;
        if(keyA > keyB) return 1;
        return 0;
    });
    let map = d3.map();
    for (var i = 0; i < data.length; i++) {
        if (!map.has[data[i].Neighborhood]) {
            map.set(data[i].Neighborhood, Number.parseInt(data[i].Incident_Number));
        }
    }
    return map;
}
var drawLineChart = function (data) {
    let y_axis_map = d3.map();
    y_axis_map.set('a', 1);

    let x_axis_map=d3.map();
    x_axis_map.set('a',1);
    let map = getData(data);

    let svg = d3.select('body').select('svg');
    let margin = {
        top: 20,
        right: 20,
        bottom: 140,
        left: 50
    };
    let neighbourhood = map.keys();
    let countMin = 0;
    let countMax = d3.max(map.values());
    let bounds = svg.node().getBoundingClientRect();
    console.log(bounds);
    console.log([countMin, countMax]);

    let plotWidth = bounds.width - margin.left - margin.right;
    let plotHeight = bounds.height - margin.top - margin.bottom;

    let plot = svg.select("g#plot")
    if (plot.size() < 1) {
        plot = svg.append("g")
            .attr('id', 'plot')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    }

    let neighbourhoodScale = d3.scaleBand()
        .domain(neighbourhood)
        .rangeRound([0, plotWidth])
        .paddingInner(0.3);

    let countScale = d3.scaleLinear()
        .domain([countMin, countMax])
        .range([plotHeight, 0])
        .nice();

    let xAxis = d3.axisBottom(neighbourhoodScale);
    let xGroup = plot.append("g").attr("id", "x-axis");
    xGroup.call(xAxis)
        .attr("transform", "translate(0," + plotHeight + ")")
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    let yAxis = d3.axisLeft(countScale);
    let yGroup = plot.append("g").attr("id", "y-axis");
    yGroup.call(yAxis);


    let line = d3.line()
        .x(function (d) {
            return neighbourhoodScale(d.Neighborhood)
        })
        .y(function (d) {
            return countScale(d.Incident_Number)
        });
    plot.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
    var paddingForText = 15;
  /*  plot.append("g").selectAll("text.details")
        .data(data)
        .enter()
        .append("text")
        .attr("x", function (d) {
            return neighbourhoodScale(d.Neighborhood) - paddingForText
        })
        .attr("y", function (d) {
            return countScale(d.Incident_Number) + paddingForText-18
        })
        .attr("fill", "red")
        .text(function (d) {
            return d.Incident_Number
        }).attr('style', 'font-weight:bold;font-size:small');*/
    let text_y=plot.selectAll('text.axis-y')
    .data(y_axis_map.entries())
    .enter()
    .append("text")
    .attr('class','axis-y')
    .text('Incident Number')
    .attr('text-anchor',"start")
    .attr("transform","translate(-35 ," +(plotHeight/2+45) + ")rotate(-90)")
    .attr('fill','brown');

    let text_x=plot.selectAll('text.axis-x')
    .data(y_axis_map.entries())
    .enter()
    .append("text")
    .attr('class','axis-x')
    .text('Neighborhood')
    .attr('text-anchor',"middle")
    .attr("transform","translate("+(plotWidth/2-50)+ "," +(plotHeight+120) + ")")
    .attr('fill','brown');
}
