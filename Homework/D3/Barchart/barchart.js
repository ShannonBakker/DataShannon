InitChart();

function InitChart() {

  var lineData = [{
    'x': 1,
    'y': 5
  }, {
    'x': 20,
    'y': 20
  }, {
    'x': 40,
    'y': 10
  }, {
    'x': 60,
    'y': 40
  }, {
    'x': 80,
    'y': 5
  }, {
    'x': 100,
    'y': 60
  }];

  var vis = d3.select("#visualisation"),
    WIDTH = 1000,
    HEIGHT = 500,
    MARGINS = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 50
    },
    xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineData, function (d) {
        return d.x;
      }),
      d3.max(lineData, function (d) {
        return d.x;
      })
    ]),

    yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function (d) {
        return d.y;
      }),
      d3.max(lineData, function (d) {
        return d.y;
      })
    ]),

    xAxis = d3.svg.axis()
      .scale(xRange)
      .tickSize(5)
      .tickSubdivide(true),

    yAxis = d3.svg.axis()
      .scale(yRange)
      .tickSize(5)
      .orient("left")
      .tickSubdivide(true);


  vis.append("svg:g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
    .call(xAxis);

  vis.append("svg:g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + (MARGINS.left) + ",0)")
    .call(yAxis);

  var lineFunc = d3.svg.line()
  .x(function (d) {
    return xRange(d.x);
  })
  .y(function (d) {
    return yRange(d.y);
  })
  .interpolate('linear');

vis.append("svg:path")
  .attr("d", lineFunc(lineData))
  .attr("stroke", "blue")
  .attr("stroke-width", 2)
  .attr("fill", "none");

}



// set the width and hight of the chart
var margin = {top: 50, right: 30, bottom: 120, left: 70},
   width = 1200 - margin.left - margin.right,
   height = 600 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")

// add a tooltip
// inspiration from : http://bl.ocks.org/Caged/6476579
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<font size = 2px face=sans-serif>Buitenlandse toeristen: " + d["foreign_tourists"] + ".000</font>";
  }) 
  
// set size of the chart
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
chart.call(tip);

// load the data from the json	
d3.json("tourists.json", function(error, data){
	if (error) throw error;
	
	x.domain(data.data.map(function(d){ return d.Month}));
	y.domain([0, d3.max(data.data, function(d){return  d.foreign_tourists*1000})]);

	// append the x axis to the chart
	chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")", "rotate(-50)")
		.call(xAxis)
		.selectAll("text")
			.attr("y", 10)
			.attr("x", 9)
			.attr("dy", ".35em")
			.attr("transform", "rotate(45)")
			.style("text-anchor", "start")
			

	// append the y axis to the chart
	chart.append("g")
		.attr("class", "y axis")
		.call(yAxis)
    .append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".75em")
		.style("font-size","15px")
		.style("text-anchor", "end")
		.text("Buitenlandse toeristen");

	// append the bars to the text
	chart.selectAll(".bar")
		.data(data.data)
    .enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return x(d.Month); })
		.attr("width", x.rangeBand())
		.attr("y", function(d) { return y(d.foreign_tourists*1000); })
		.attr("height", function(d) { return height - y(d.foreign_tourists*1000); })
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide)
	
	// append the title
	chart.append("text")
        .attr("x", (width))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "end")  
        .style("font-size", "17px")  
        .text("Aantal buitenlandse toeristen dat Nederland bezoekt");
});

function type(d) {
  d["foreign_tourists"]= +d["foreign_tourists"];
  return d;
}





