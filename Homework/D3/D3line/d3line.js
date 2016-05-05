http://www.sitepoint.com/creating-simple-line-bar-charts-using-d3-js/


// set the margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatDate = d3.time.format("%d-%b-%y").parse;
var format = d3.time.format("%d-%b-%y")

// prepare the axis	
var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// make a function for the line	
var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.average_temp); });


// intialize the graph
var lineChart = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load the data
d3.json("data.json", function(error, data) {
	if (error) throw error;
	data.data.forEach(function(d) {
		d.date = format(new Date(d.year, d.month-1, d.day));
        d.date = formatDate(d.date);
        d.average_temp = d.average_temp/10; 
    });
	
	//determine the domain
    x.domain(d3.extent(data.data, function(d) { return d.date; }));
	y.domain(d3.extent(data.data, function(d) { return d.average_temp; }));	

	// makt the x axis
	lineChart.append("g")
      .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")", "rotate(-50)")
		.call(xAxis)
	
	//make the y axis
  lineChart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
	  .style("font-size", "11px") 
      .text("Temperaturde (degrees Celsius)");
	
	// make the line
    lineChart.append("path")
      .datum(data.data)
      .attr("class", "line")
      .attr("d",line);
	  
	 // append the title
	lineChart.append("text")
        .attr("x", (width))             
        .attr("y", 0)
        .attr("text-anchor", "end")  
        .style("font-size", "17px")  
        .text("Average temperature in de Bilt (2015)");
 });
 
 