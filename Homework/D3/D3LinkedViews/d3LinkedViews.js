// inspiration for this code from https://github.com/markmarkoh/datamaps/blob/master/src/examples/highmaps_world.html
var number = 0
// make the pie

// set the margins
var width = 360;
var height = 360;
var radius = Math.min(width, height) / 2;

//determine the color scheme
var color_pie = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

// make the svg	
var svg = d3.select('#container_pie')
    .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + (width / 2) + 
        ',' + (height / 2) + ')');

// set the arc
var arc = d3.svg.arc()
	.outerRadius(radius);

// set the pie
var pie = d3.layout.pie()
	.value(function(d) { return d.count; })
	.sort(null);	

// make the tooltip
var tooltip = d3.select('#chart')                             
    .append('div')                                            
    .attr('class', 'tooltip');                                    
                      
    tooltip.append('div')                                          
    .attr('class', 'label');                                      
             
    tooltip.append('div')                                          
    .attr('class', 'count');  
	
	
// load the data from the csv
d3.csv("sources.csv", function(data){
			
	// convert the data to the correct format, missing values get an absurd high value, so they can be coloured separately
	for (i = 0; i < data.length; i++){
		if(data[i].Energy == ""){
			data[i].Energy = 1000001
		}
		else{
			data[i].Energy = Number(data[i].Energy).toFixed(2)
		}
	}
	
	var dataset = {};
			
    // create color function
	var color = d3.scale.threshold()
    .domain([100, 500, 1000, 2000, 3000,4000,5000,10000])
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
	data.forEach(function(item){ 
		var iso = item.Country,
            value = item.Energy;
			dataset[iso] = { numberOfThings: value, fillColor: color(value) };
    });
		
    // render map
    var map = new Datamap({
        element: document.getElementById('container_map'),
        fills: { defaultFill: '#F5F5F5' },
        data: dataset,
        geographyConfig: {
            highlightFillColor: "#004529",
            popupTemplate: function(geo, data1) {
				for (i = 0; i < data.length; i++) {
					if (data[i].Country == geo.id){
						
						// fill the pie
						
						// set the data in the correct format
						number = i;
						var dataset = [
						{label : 'Fossil', count: parseInt(data[number].Fossil)},
						{label: 'Renewable', count: parseInt(data[number].Renewable)},
						{label: 'Alternative', count: parseInt(data[number].Alternative)}
						];
						console.log(dataset)
						
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
						
						// add the tooltip
						path.on('mouseover', function(d) {                                                         
							tooltip.select('.label').html(d.data.label);                
							tooltip.select('.count').html(d.data.count);                
							tooltip.style('display', 'block'); 
						})

					}
				}
                if (!data) { return ; }
				else if (data1.numberOfThings < 1000000){
                return [
					'<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Energy per capita:<strong> $', data1.numberOfThings, '</strong>',
                    '</div>'].join('');
				}
				else{
				return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Energy per capita is unknown',
                    '</div>'].join('');
				}
			
			}
        }
	})	

});


                                                 
          
      
