
d3.select("body").append("h1").html("My beautiful text")

d3.json("csv.json", function(error, data) {
    console.log(data);
});