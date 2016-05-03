var h = 1000;
var w = 1000;

var svg = d3.select('body').append('svg').attr({width:w, height:h});

//draw the map
d3.json('world.json', function(json) {
  svg.selectAll('path')
  .data(json.features)
  .enter()
  .append('path')
  .attr('d', path)
  .attr('stroke', '#666666')
  .attr('stroke-width', '1px')
  .attr('fill', 'none');
});

var projection = d3.geo.mercator()
    .scale((w + 1) / 2 / Math.PI)
    .translate([w / 2, h / 2])
    .precision(.1);

var path = d3.geo.path()
    .projection(projection);

//color the map
d3.csv
