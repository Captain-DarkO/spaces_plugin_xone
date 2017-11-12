/**
 * Created by sumit on 11/11/17.
 */
// margin
var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 500 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom,
    radius = width/2;

// color range
var color = d3.scaleOrdinal()
    .range(["#BBDEFB", "#5c6bc0", "#7e57c2", "#29b6f6", "#4caf50", "#afb42b", "#ff9800"]);

// pie chart arc. Need to create arcs before generating pie
var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

// donut chart arc
var arc2 = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 120);

// arc for the labels position
var labelArc = d3.arc()
    .outerRadius(radius - 50)
    .innerRadius(radius - 100);

// generate pie chart and donut chart
var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.value; });

// define the svg for pie chart
var svg = d3.select("#main").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// define the svg donut chart
var svg2 = d3.select("#main").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// import data
d3.json("output.json", function(error, data) {
    if (error) throw error;

    // parse data
    data[1].forEach(function(d) {

        d.value = +d.value;
        d.key = d.key;
        console.log(d.value+" "+d.key);
    })

    // "g element is a container used to group other SVG elements"
    var g = svg.selectAll(".arc")
        .data(pie(data[1]))
        .enter().append("g")
        .attr("class", "arc");

    // append path
    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.key); })
        // transition
        .transition()
        .ease(d3.easeLinear)
        .duration(2000)
        .attrTween("d", tweenPie);

    // append text
    g.append("text")
        .transition()
        .ease(d3.easeLinear)
        .duration(2000)
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.data.key; });


    // "g element is a container used to group other SVG elements"
    var g2 = svg2.selectAll(".arc2")
        .data(pie(data[1]))
        .enter().append("g")
        .attr("class", "arc2");

    // append path
    g2.append("path")
        .attr("d", arc2)
        .style("fill", function(d) { return color(d.data.key); })
        .transition()
        .ease(d3.easeLinear)
        .duration(2000)
        .attrTween("d", tweenDonut);

    // append text
    g2.append("text")
        .transition()
        .ease(d3.easeLinear)
        .duration(2000)
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.data.value; });

});

// Helper function for animation of pie chart and donut chart
function tweenPie(b) {
    b.innerRadius = 0;
    var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
    return function(t) { return arc(i(t)); };
}

function tweenDonut(b) {
    b.innerRadius = 0;
    var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
    return function(t) { return arc2(i(t)); };
}