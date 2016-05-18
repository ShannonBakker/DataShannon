// inspiration for this code from https://github.com/markmarkoh/datamaps/blob/master/src/examples/highmaps_world.html
// http://bl.ocks.org/biovisualize/1016860
// http://zeroviscosity.com/d3-js-step-by-step/step-5-adding-tooltips

// make the pie
file = "sources.csv"
domain_range = [100, 500, 1000, 2000, 3000,4000,5000,10000]

function makegraph(file, domain_range){
console.log()
// set the margins
var width = 360;
var height = 360;
var radius = Math.min(width, height) / 2;

//determine the color scheme
var color_pie = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

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

	

d3.csv(file, function(data){
			
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
                if (!data1) { return ; }
				else if (data1.numberOfThings < 1000000){
                return [
					'<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Energy per capita:<strong>', data1.numberOfThings, '</strong>',
                    '</div>'].join('');
				}
				else{
				return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Energy per capita is unknown',
                    '</div>'].join('');
				}
			
			}
        },
		done: function(datamap) {
        datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
            console.log(geography);
			for (i = 0; i < data.length; i++) {
					if (data[i].Country == geography.id){
						
						// remove the old pie 
						d3.select('#pie').remove();
						// make the svg	
				
					var svg = d3.select('#container_pie')
						.append('svg')
							.attr('id', 'pie')
							.attr('width', width)
							.attr('height', height)
							.append('g')
							.attr('transform', 'translate(' + (width / 2) + 
							',' + (height / 2) + ')');


						
						// set the data in the correct format
						number = i;
						unknown =0 

						// check if any part of the data is unknown
						if ( Number(data[i].Fossil) + Number(data[i].Renewable) + Number(data[i].Alternative) < 100){
							unknown = Number(data[i].Fossil) + Number(data[i].Renewable) + Number(data[i].Alternative)
							unknown = 100 - unknown
							console.log("unknown",unknown)
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
						
						
						// add the tooltip
						path.on("mouseover", function(d){return tooltip.text(d.data.label + ": " + d.data.count+"%").style("visibility", "visible");})
						path.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
						path.on("mouseout", function(){return tooltip.style("visibility", "hidden");});

					}
				}
        });
    }
		
	})	

});

}


makegraph(file, domain_range)

// ** Update data section (Called from the onclick)
function updateData() {
	d3.select('svg').remove();
	domain_range = [2, 4, 6, 8, 10,12,14,16]
	
	console.log("hallo")
    
	makegraph("sources_GDP.csv", domain_range)

};

function updateData2() {
	d3.select('svg').remove();
	domain_range = [100, 500, 1000, 2000, 3000,4000,5000,10000]
	
	console.log("hallo")
    
	makegraph("sources.csv", domain_range)

};



                                                 
          
      
