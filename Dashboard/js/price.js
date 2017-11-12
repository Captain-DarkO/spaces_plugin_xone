/**
 * Created by sumit on 12/11/17.
 */
/**
 * Created by sumit on 11/11/17.
 */
// margin
var margin = {top: 10, right: 20, bottom: 20, left: 10},
    width = 500 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom,
    radius = width/2;

// color range
var color = d3.scaleOrdinal()
    .range(["#BBDEFB", "#5c6bc0", "#7e57c2", "#29b6f6", "#4caf50", "#afb42b", "#ff9800"]);

// pie chart arc. Need to create arcs before generating pie
var arc = d3.arc()
    .outerRadius(radius - 100)
    .innerRadius(0);


// arc for the labels position
var labelArc = d3.arc()
    .outerRadius(radius - 50)
    .innerRadius(radius - 200);

// generate pie chart and donut chart
var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.value; });

// define the svg for pie chart
var svg = d3.select("#price").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


// import data
d3.json("output.json", function(error, data) {
    console.log (data);
    if (error) throw error;

    // parse data
    data[2].forEach(function(d) {

        d.value = +d.value;
        d.key = d.key;
        console.log(d.value+" "+d.key);
    })

    // "g element is a container used to group other SVG elements"
    var g = svg.selectAll(".arc")
        .data(pie(data[2]))
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
        .text(function(d) { return d.data.key+"  ("+d.data.value+")"; });


    // "g element is a container used to group other SVG elements"
    var g2 = svg2.selectAll(".arc2")
        .data(pie(data[2]))
        .enter().append("g")
        .attr("class", "arc2");





});

// Helper function for animation of pie chart and donut chart
function tweenPie(b) {
    b.innerRadius = 0;
    var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
    return function(t) { return arc(i(t)); };
}
