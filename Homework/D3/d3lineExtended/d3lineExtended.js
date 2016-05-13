// Shannon Bakker
// inspiration from http://www.sitepoint.com/creating-simple-line-bar-charts-using-d3-js/ and http://bl.ocks.org/mbostock/3902569

// set the margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// the formulas that put the date in the correct format
var formatDate = d3.time.format("%d-%b-%y").parse;
var format = d3.time.format("%d-%b-%y")
var bisectDate = d3.bisector(function(d) { return d.date; }).left

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

// initialize the graph
var lineChart = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load the data
d3.json("data.json", function(error, data) {
	if (error) {
		console.log("error")
		throw new Error("Something went badly wrong!");
}
	
	console.log(data);
	
	data.data.forEach(function(d) {
		d.date = format(new Date(d.year, d.month-1, d.day));
        d.date = formatDate(d.date);
        d.average_temp = d.average_temp/10; 
		d.min_temp = d.min_temp/10; 
		d.max_temp = d.max_temp/10; 
    });
	
	//determine the domain
    x.domain(d3.extent(data.data, function(d) { return d.date; }));
	var min_temp = d3.extent(data.data, function(d) { return d.min_temp; })[0];
	var max_temp = d3.extent(data.data, function(d) { return d.max_temp; })[1];
	y.domain([min_temp,max_temp])
	
	// make the x axis
	lineChart.append("g")
      .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")", "rotate(-50)")
		.call(xAxis)
	
	//make the y axis
	lineChart.append("g")
      .attr("class", "axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("dy", ".75em")
      .style("text-anchor", "end")
	  .style("font-size", "11px") 
      .text("Temperature (degrees Celsius)");
	
	// make the lines
    lineChart.append("path")
      .datum(data.data)
      .attr("class", "line")
	  .attr("y", 100)
	  .attr("dy", ".75em")
      .attr("d", d3.svg.line()
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y(d.average_temp); }))
	
	lineChart.append("path")
      .datum(data.data)
      .attr("class", "line_max")
	  .attr("y", 100)
	  .attr("dy", ".75em")
      .attr("d", d3.svg.line()
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y(d.max_temp); }))
	
	lineChart.append("path")
      .datum(data.data)
      .attr("class", "line_min")
	  .attr("y", 100)
	  .attr("dy", ".75em")
      .attr("d", d3.svg.line()
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y(d.min_temp); }))
	
	  
	 // append the title
	lineChart.append("text")
        .attr("x", (width))             
        .attr("y", 0)
        .attr("text-anchor", "end")  
        .style("font-size", "17px")  
        .text("Temperature in de Bilt (2015)");
	
	// append the dot
	var dot = lineChart.append("g")
      .attr("class", "dot")
      .style("display", "none")
	dot.append("circle")
      .attr("r", 3);
	dot.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

	// append the overlay, necessary for the tooltip
	lineChart.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() { dot.style("display", null); })
      .on("mousemove", mousemove);

	// the function for the mousemove, inspiration from http://bl.ocks.org/mbostock/3902569
	function mousemove() {
		var xinverterd = x.invert(d3.mouse(this)[0]),
			i = bisectDate(data.data, xinverterd, 1),
        d0 = data.data[i - 1],
        d1 = data.data[i],
        d = xinverterd - d0.date > d1.date - xinverterd ? d1 : d0;
	dot.attr("transform", "translate(" + x(d.date) + "," + y(d.average_temp) + ")");
    dot.select("text").text(d.average_temp +" degrees Celsius "+  format(d.date));
  }
  
 });
 
 