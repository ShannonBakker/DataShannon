  
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1500 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.001);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")

// inspiration from : http://bl.ocks.org/Caged/6476579
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Frequency:</strong> <span>" + d["Aantal toeristen"] + "</span>";
  }) 
  
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

chart.call(tip);
  d3.json("toeristen.json", function(error, data){
	console.log(data)
  x.domain(data.map(function(d){ return d.Maand}));
  y.domain([0, d3.max(data, function(d){return 1300})]);

  console.log(data[0].Maand)
  
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".75em")
      .style("text-anchor", "end")
      .text("Aantal toeristen");

  chart.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Maand); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d["Aantal toeristen"]); })
      .attr("height", function(d) { return height - y(d["Aantal toeristen"]); })
	  .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
});

function type(d) {
  d["Aantal toeristen"]= +d["Aantal toeristen"];
  return d;
}





