var h = 1000;
var w = 1000;

var svg = d3.select('body').append('svg').attr({width:w, height:h});

var projection = d3.geo.mercator()
    .scale((w + 1) / 2 / Math.PI)
    .translate([w / 2, h / 2])
    .precision(.1);

var path = d3.geo.path()
    .projection(projection);

var color = d3.scale.linear()
  .range(['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b']);

d3.csv('women_15_to_24.csv', function(data) {

  color.domain([0, 17
  //   d3.max(data, function(d) {
  //   return d.mean;
  // })
    ]);

  d3.json('world.json', function(json) {

  for (var i = 0; i < data.length; i++) {
    if(data[i].year === '1970') {
      var dataCountry = data[i].location_name;
      var educationLevel = parseFloat(data[i].mean)

      for (var j = 0; j < json.features.length; j++) {
        var jsonCountry = json.features[j].properties.sovereignt;

        if (dataCountry === jsonCountry) {
        json.features[j].properties.value = educationLevel;
        break;
        }
      }
    }
  }

  svg.selectAll('path')
    .data(json.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('stroke', '#666666')
    .attr('stroke-width', '1px')
    .style('fill', function(d) {
      console.log(d.properties.value);
      var value = d.properties.value
      if(value) {
        return color(value);
      }
    });

  });
});


