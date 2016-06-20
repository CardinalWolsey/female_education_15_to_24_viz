var h = 900;
var w = 1100;

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
  color.domain([0, 1]);

  d3.json('world.json', function(json) {

    //this could be made more performant
    //puts education data in geojson object for specified year
    function colorData(year) {
      for (var i = 0; i < data.length; i++) {
        if(data[i].year === year) {
          var locationCode = data[i].location_code;
          var educationLevel = parseFloat(data[i].mean);

          for (var j = 0; j < json.features.length; j++) {
            var jsonCountry = json.features[j].properties.iso_a3;

            if (locationCode === jsonCountry) {
            json.features[j].properties.value = educationLevel;
            break;
            }
          }
        }
      }
    return json.features;
    }

    //draws and colors the map on page load
    var mapColors = svg.selectAll('path')
      .data(colorData('1970'))
      .enter()
      .append('path')
      .attr('d', path)
      .attr('stroke', '#cccccc')
      .attr('stroke-width', '1px')
      .style('fill', function(d) {
        var value = d.properties.value;
        if(value) {
          return color(value);
        }
        if(value === undefined) {
          return '#ffffff';
        }
    });

    var label = svg.append('text')
      .attr('class', 'year label')
      .attr('text-anchor', 'end')
      .attr('x', w - 50)
      .attr('y', 200)
      .text(1970);

    //gets the bounding box of the
    var box = label.node().getBBox();

    var overlay = svg.append('rect')
      .attr('class', 'overlay')
      .attr('x', box.x)
      .attr('y', box.y)
      .attr('width', box.width)
      .attr('height', box.height)
      .on('mouseover', enableInteraction);

    //functionality for all mouse events
    function enableInteraction() {
      var yearScale = d3.scale.linear()
        .domain([1970, 2015])
        .range([box.x, box.x + box.width])
        .clamp(true);

      overlay
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('mousemove', mousemove)
        .on('touchmove', mousemove);

      function mouseover() {
        label.classed('active', true);
      }

      function mouseout() {
        label.classed('active', false);
      }

      function mousemove() {
        displayYear(yearScale.invert(d3.mouse(this)[0]));
      }
    }

    //updates label, recalculates data, and redraws map fill on mouse event
    function displayYear(year) {
      var roundYear = (Math.round(year)).toString();
      label.text(roundYear);

      svg.selectAll('path').data(colorData(roundYear))
      .style('fill', function(d) {
        var value = d.properties.value;
        if(value) {
          return color(value);
        }
        if(value === undefined) {
          return '#ffffff';
        }
      });
    }

  });
});
