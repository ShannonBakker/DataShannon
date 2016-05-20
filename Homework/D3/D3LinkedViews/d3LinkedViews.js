// inspiration for this code from https://github.com/markmarkoh/datamaps/blob/master/src/examples/highmaps_world.html and http://bl.ocks.org/biovisualize/1016860 and  http://zeroviscosity.com/d3-js-step-by-step/step-5-adding-tooltips 
// Shannon Bakker 11201401

function makegraph(file, domain_range, capita){	
	// load the data 
	d3.csv(file, function(error, data){
		if (error) {
		alert("Something went wrong while loading the data")
		}	
	
		// convert the data to the correct format, missing values get an absurd high value, so they can be coloured separately
		for (i = 0; i < data.length; i++){
			if(data[i].Energy == ""){
				data[i].Energy = 1000001
			}
			else{
				data[i].Energy = Number(data[i].Energy).toFixed(2)
			}
		}
	
		// create color function
		var color = d3.scale.threshold()
		.domain(domain_range)
		.range(["#f7fcfd",
			"#e0ecf4",
			"#bfd3e6",
			"#9ebcda",
			"#8c96c6",
			"#8c6bb1",
			"#88419d",
			"#6e016b",
			"#fed976"]);
		
		// fill dataset in appropriate format
		var dataset_map = {};
		data.forEach(function(item){ 
			var iso = item.Country,
				value = item.Energy;
				dataset_map[iso] = { numberOfThings: value, fillColor: color(value) };
		});
		
		// render map
		var map = new Datamap({
			element: document.getElementById('container_map'),
			fills: { defaultFill: '#fed976' },
			data: dataset_map,
			geographyConfig: {
				highlightFillColor: "#004529",
				popupTemplate: function(geo, data_map) {
					if (capita == 1){
						if (!data_map) { 
							return ['<div class="hoverinfo">',
							'<strong>', geo.properties.name, '</strong>',
							'<br>Energy per capita is unknown',
							'</div>'].join('');
						}
						else if (data_map.numberOfThings < 1000000){
						return [
							'<div class="hoverinfo">',
							'<strong>', geo.properties.name, '</strong>',
							'<br>Energy per capita: <strong>', data_map.numberOfThings, ' </strong> kg of oil equivalent',
							'</div>'].join('');
						}
						else{
						return ['<div class="hoverinfo">',
							'<strong>', geo.properties.name, '</strong>',
							'<br>Energy per capita is unknown',
							'</div>'].join('');
						};
					}
					else	{
						if (!data_map) { 
							return ['<div class="hoverinfo">',
							'<strong>', geo.properties.name, '</strong>',
							'<br>GDP per unit of energy use is unknown',
							'</div>'].join('');
						}
						else if (data_map.numberOfThings < 1000000){
						return [
							'<div class="hoverinfo">',
							'<strong>', geo.properties.name, '</strong>',
							'<br>GDP per unit of energy use : <strong>', data_map.numberOfThings, ' </strong> (constant 2011 PPP $ per kg of oil equivalent)',
							'</div>'].join('');
						}
						else{
						return ['<div class="hoverinfo">',
							'<strong>', geo.properties.name, '</strong>',
							'<br>GDP per unit of energy use is unknown',
							'</div>'].join('');
						};
					};
				}
			},
			done: function(datamap) {
				datamap.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
					for (i = 0; i < data.length; i++) {
						if (data[i].Country == geo.id){
						
							// remove the old pie 
							d3.select('#pie').remove();
						
							// set the margins of the pie
							var width_pie = 360;
							var height_pie = 360;
							var radius = Math.min(width_pie, height_pie) / 2;

							// determine the color scheme
							var color_pie = d3.scale.ordinal()
								.range(["#1b9e77", "#d95f02", "#7570b3", "#e7298a"]);
	
							// set the arc
							var arc = d3.svg.arc()
								.outerRadius(radius);
	
							// set the pie
							var pie = d3.layout.pie()
								.value(function(d) { return d.count; })
								.sort(null);	

							// set the tooltip
							var tooltip = d3.select("body")
								.append("div")
								.style("position", "absolute")
								.style("z-index", "10")
					
							// make the svg	
							var svg = d3.select('#container_pie')
								.append('svg')
								.attr('id', 'pie')
								.attr('width', width_pie+80)
								.attr('height', height_pie)
								.append('g')
								.attr('transform', 'translate(' + (width_pie / 2) + ',' + (height_pie / 2) + ')');

							// set the data in the correct format
							number = i;
							unknown =0 

							// check if any part of the data is unknown
							if ( Number(data[i].Fossil) + Number(data[i].Renewable) + Number(data[i].Alternative) < 99.5){
								unknown = Number(data[i].Fossil) + Number(data[i].Renewable) + Number(data[i].Alternative);
								unknown = Number(100 - unknown).toFixed(2);
							}	
						
							// remove the pie if unknown is bigger than 99%
							if (unknown>99){
								d3.select('#pie').remove();
							}
						
							// put the data in the correct format
							var dataset = [
							{label : 'Fossil', count: Number(data[i].Fossil).toFixed(2)},
							{label: 'Renewable', count: Number(data[i].Renewable).toFixed(2)},
							{label: 'Alternative', count: Number(data[i].Alternative).toFixed(2)},
							{label: 'Unknown', count: unknown}
							];
						
							// make the pie
							var path = svg.selectAll('path')
								.data(pie(dataset))
								.enter()
								.append('path')
								.attr('d', arc)
								.attr('fill', function(d, i) { 
									return color_pie(d.data.label);
								})
								.each(function(d) { this._current = d; });
						
							// add the legend
							var legendRectSize = 18;
							var legendSpacing = 5;
							var legend = svg.selectAll('.legend')
								.data(color_pie.domain())
								.enter()
								.append('g')
								.attr('class', 'legend')
								.attr('transform', function(d, i) {
									var height = legendRectSize + legendSpacing;
									var offset =  height * color.domain().length / 2;
									var horz = 9 * legendRectSize;
									var vert = i * height - offset * 1.9;
									return 'translate(' + horz + ',' + vert + ')';
								});
	
							legend.append('rect')
								.attr('width', legendRectSize)
								.attr('height', legendRectSize)
								.style('fill', color_pie)
								.style('stroke', color_pie);
  
							legend.append('text')
								.attr('x', legendRectSize + legendSpacing)
								.attr('y', legendRectSize - legendSpacing)
								.text(function(d) { return d; });
						
							// add the tooltip
							path.on("mouseover", function(d){return tooltip.text(d.data.label + ": " + d.data.count+"%").style("visibility", "visible");})
							path.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
							path.on("mouseout", function(){return tooltip.style("visibility", "hidden");});
						};
					};
				});
			}	
		})
	});
};

file = "sources.csv";
domain_range = [100, 500, 1000, 2000, 3000,4000,5000,10000];
capita = 1
makegraph(file, domain_range, capita);

// update the data on a mouse click
function updateData_GDP() {
	d3.select('svg').remove();
	domain_range = [2, 4, 6, 8, 10,12,14,100]
    capita = 0
	makegraph("sources_GDP.csv", domain_range, capita)

};
function updateData_Capita() {
	d3.select('svg').remove();
	domain_range = [500, 1000, 1500, 2000,2500,3000,3500,10000]
	capita = 1
	makegraph("sources.csv", domain_range, capita)

};



                                                 
          
      
