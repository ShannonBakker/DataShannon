// inspiration for this code from https://github.com/markmarkoh/datamaps/blob/master/src/examples/highmaps_world.html

// load the data from the csv
d3.csv("gdp-world.csv", function(data){
			
	// convert the data to the correct format, missing values get an absurd high value, so they can be coloured separately
	for (i = 0; i < data.length; i++){
		if(data[i].GDP == ""){
			data[i].GDP = 1000001
		}
		else{
			data[i].GDP = Number(data[i].GDP).toFixed(2)
		}
	}
	
	var dataset = {};
			
    // create color function
	var color = d3.scale.threshold()
    .domain([1000, 5000, 10000, 20000, 30000,40000,50000,100000])
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
            value = item.GDP;
			dataset[iso] = { numberOfThings: value, fillColor: color(value) };
    });
	

	
    // render map
    var map = new Datamap({
        element: document.getElementById('container'),
        fills: { defaultFill: '#F5F5F5' },
        data: dataset,
        geographyConfig: {
            highlightFillColor: "#004529",
            popupTemplate: function(geo, data) {
                if (!data) { return ; }
				else if (data.numberOfThings < 1000000){
                return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>GDP per capita:<strong> $', data.numberOfThings, '</strong>',
                    '</div>'].join('');
				}
				else{
				return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>GDP per capita is unknown',
                    '</div>'].join('');
				}
            }
        }
	
	})
	

});
			
			