var h = 900;
var w = 1100;

var svg = d3.select('body').append('svg').attr({width:w, height:h});

var projection = d3.geo.mercator()
    .scale((w + 1) / 2 / Math.PI)
    .translate([w / 2, h / 2])
    .precision(.1);

var path = d3.geo.path()
    .projection(projection);

//***I need to resolve this part
var color = d3.scale.linear()
  .range(['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b']);

d3.csv('women_15_to_24.csv', function(data) {
//***I need to resolve this part
  color.domain([0, 1]);

  d3.json('world.json', function(json) {

    //this needs to be made more performant
    function colorData(year) {
    for (var i = 0; i < data.length; i++) {
      if(data[i].year === year) {
        var locationCode = data[i].location_code;
        var educationLevel = parseFloat(data[i].mean)

        for (var j = 0; j < json.features.length; j++) {
          var jsonCountry = json.features[j].properties.iso_a3;

          if (locationCode === jsonCountry) {
          json.features[j].properties.value = educationLevel;
          json.features[j].properties.year = data[i].year
          break;
          }
        }
      }
    }
    return json.features;
    }

    // console.log(json);
    // colorData('2010');
    // console.log(json);
    // colorData('1971');
    // console.log(json);

    // console.log(json.features);

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
    });
      // .call(colorCountry);

//new code goes here
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

    // function colorCountry(path) {
    //   path.style('fill', function(d) {return d.properties.value;});
    //   console.log('called colorCountry')
    // }

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

    function displayYear(year) {
      roundYear = (Math.round(year)).toString();
      label.text(roundYear);
      console.log(roundYear);
      console.log(year);

      svg.selectAll('path').data(colorData(roundYear))
        // .call(colorCountry);
      .style('fill', function(d) {
        var value = d.properties.value;
        // console.log(d.properties.year)
        // console.log(value);
        if(value) {
          return color(value);
        }
      });

      // svg.selectAll('path')
      //   .data(colorData(year))
      //   .enter()
      //   .append('path')
      //   .attr('d', path)
      //   .attr('stroke', '#cccccc')
      //   .attr('stroke-width', '1px')
      //   .style('fill', function(d) {
      //     var value = d.properties.value;
      //     if(value) {
      //       return color(value);
      //     }
      // });
    }

  });
});


//make a style function and call it
//may need to use the key property
