// load the data from the csv
d3.csv("gdp-world.csv", function(data){
			
	// convert the data to the correct format
	for (i = 0; i < data.length; i++){
		if(data[i].GDP == ""){
			data[i].GDP = 1000001
		}
		else{
			data[i].GDP = Number(data[i].GDP).toFixed(2)
		}
	}
	
	var dataset = {};
			
	var onlyValues = data.map(function(obj){ 
		if (obj.GDP != "missing"){
			return obj.GDP
		}
		else{
			return 6000
		}; 
	});	
    var minValue = Math.min.apply(null, onlyValues),
            maxValue = Math.max.apply(null, onlyValues);
			
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
		//if (value=="missing"){
			//dataset[iso] = { numberOfThings: value, fillColor: "#fed976" };
		//} 
		//else{ 
			dataset[iso] = { numberOfThings: value, fillColor: color(value) };
		//}
    });
	
    // render map
    new Datamap({
        element: document.getElementById('container'),
        projection: 'mercator', 
        fills: { defaultFill: '#F5F5F5' },
        data: dataset,
        geographyConfig: {
            borderColor: '#DEDEDE',
            highlightBorderWidth: 2,
            // change color and border country on mouse hover
            highlightFillColor: '#fc9272',
            highlightBorderColor: '#B7B7B7',
            // show desired information in tooltip
            popupTemplate: function(geo, data) {
                // don't show tooltip if country not present in dataset
                if (!data) { return ; }
				// determine the info that the tooltip has to show
				if (data.numberOfThings < 1000000){
                return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>GDP per capita: $<strong>', data.numberOfThings, '</strong>',
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
			
			