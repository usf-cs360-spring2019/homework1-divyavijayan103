var getData=function(data){
  var map=d3.map();
  for(var i=0;i<data.length;i++){
    if(!map.has(data[i].Incident_Category)){
      map.set(data[i].Incident_Category,Number.parseInt(data[i].Incident_Number));
    }
  }
  return map;
};

var drawGraph=function(data){
  var y_Axis_map=d3.map();
  y_Axis_map.set('a',1);
  var x_Axis_map=d3.map();
  x_Axis_map.set('a',1);
  var map=getData(data);

  let incidents=map.keys();
  let svg= d3.select('body').select('svg');
  let countMin=0;
  let countMax=d3.max(map.values());
  let margin={
    top : 15,
    bottom: 150,
    right : 20,
    left : 65
  };
  let bounds=svg.node().getBoundingClientRect();
  console.log(bounds);
  let plotWidth=bounds.width-margin.left-margin.right;
  let plotHeight=bounds.height-margin.top-margin.bottom;
  console.log([plotWidth,plotHeight]);
  let incidentScale=d3.scaleBand()
    .domain(incidents)
    .rangeRound([0,plotWidth])
    .paddingInner(0.2);
  let incidentCountScale=d3.scaleLinear()
  .domain([countMin,countMax])
  .range([plotHeight,0])
  .nice();


    let plot=svg.select("g#plot");
    if(plot.size()<1){
      plot=svg.append("g").attr('id','plot');
      plot.attr("transform","translate("+margin.left+","+margin.top+")");
    }
    let xAxis=d3.axisBottom(incidentScale);
    let xGroup=plot.append("g").attr("id","x-axis");
    xGroup.call(xAxis)
      .attr("transform","translate(0,"+plotHeight+")")
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(90)")
      .style("text-anchor", "start");
    let yAxis=d3.axisLeft(incidentCountScale);
    let yGroup= plot.append("g").attr("id","y-axis");
    yGroup.call(yAxis)
      //.attr("transform","translate("+plotWidth+",0)");
    let bars=plot.selectAll('rect')
        .data(map.entries());

      bars.enter().append('rect')
      .attr("class","bar")
      .attr("width",incidentScale.bandwidth())
      .attr("height",function(d){
        return plotHeight - incidentCountScale(d.value);
      })
      .attr("x",function(d){
        return incidentScale(d.key);
      })
      .attr("y",function(d){
        return incidentCountScale(d.value);
      })//.attr("style",function(d){return "fill:"+ getRandomColor()+";"});

    let text=plot.selectAll('text.details')
      .data(map.entries())
      .enter()
      .append("text")
      .attr("class","details")
      .text(function(d){
        return d.value
      })
      .attr("x",function(d){
        return incidentScale(d.key);
      })
      .attr("y",function(d){
        return incidentCountScale(d.value)-4;
      })
      .attr("fill","#A64C38");

      let text_y=plot.selectAll('text.axis')
        .data(y_Axis_map.entries())
        .enter()
        .append("text")
        .attr("class","axis")
        .text('Incident Number')
        .attr("text-anchor", "middle")
        .attr("transform", "translate(-45,"+(plotHeight/2)+")rotate(-90)")
        .attr("fill","#A64C38");
        let text_x=plot.selectAll('text.axis-x')
          .data(y_Axis_map.entries())
          .enter()
          .append("text")
          .attr("class","axis-x")
          .text('Incident Category')
          .attr("text-anchor", "middle")
          .attr("transform", "translate("+plotWidth/2+","+(bounds.height-(margin.bottom/3))+ ")")
          .attr("fill","#A64C38");

};
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
         color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
