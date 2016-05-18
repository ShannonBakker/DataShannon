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

d3.csv("sources.csv", function(data) {
  console.log(data[5])
	
	//var dataset = [
		//{label : 'Fossil', count: parseInt(data[5].Fossil)}
		//]
	var dataset = [
          { label: 'Abulia', count: 10 }, 
          { label: 'Betelgeuse', count: 20 },
          { label: 'Cantaloupe', count: 30 },
          { label: 'Dijkstra', count: 40 }
        ];
var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var labelArc = d3.svg.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {console.log( d.count); });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	
var path = svg.selectAll('path')
  .data(pie(dataset))
  .enter()
  .append('path')
  .attr('d', arc)
  .attr('fill', function(d, i) { 
    return color(d.data.label);
  });
	  


});



