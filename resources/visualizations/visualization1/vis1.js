var getData=function(data){
  var map=d3.map();
  for(var i=0;i<data.length;i++){
    if(!map.has(data[i].Day)){
      map.set(data[i].Day,data[i].Incident_Number);
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
  let days=map.keys();
  let svg= d3.select('body').select('svg');
  let countMin=0;
  let countMax=d3.max(map.values());
  let margin={
    top : 15,
    bottom: 45,
    right : 15,
    left : 65
  };
  let bounds=svg.node().getBoundingClientRect();
  console.log(bounds);
  let plotWidth=bounds.width-margin.left-margin.right;
  let plotHeight=bounds.height-margin.top-margin.bottom;
  console.log([plotWidth,plotHeight]);
  let dayScale=d3.scaleBand()
    .domain(days)
    .rangeRound([0,plotWidth])
    .paddingInner(0.5);
  let countScale=d3.scaleLinear()
  .domain([countMin,countMax])
  .range([plotHeight,0])
  .nice();


    let plot=svg.select("g#plot");
    if(plot.size()<1){
      plot=svg.append("g").attr('id','plot');
      plot.attr("transform","translate("+margin.left+","+margin.top+")");
    }
    let xAxis=d3.axisBottom(dayScale);
    let xGroup=plot.append("g").attr("id","x-axis");
    xGroup.call(xAxis)
      .attr("transform","translate(0,"+plotHeight+")");

    let yAxis=d3.axisLeft(countScale);
    let yGroup= plot.append("g").attr("id","y-axis");
    yGroup.call(yAxis)
      //.attr("transform","translate("+plotWidth+",0)");
    let bars=plot.selectAll('rect')
        .data(map.entries());

      bars.enter().append('rect')
      .attr("class","bar")
      .attr("width",dayScale.bandwidth())
      .attr("height",function(d){
        return plotHeight - countScale(d.value);
      })
      .attr("x",function(d){
        return dayScale(d.key);
      })
      .attr("y",function(d){
        return countScale(d.value)
      }).attr("style",function(d){return "fill:"+ getRandomColor(d)+";"});

    let text=plot.selectAll('text.details')
      .data(map.entries())
      .enter()
      .append("text")
      .attr("class","details")
      .text(function(d){
        return d.value
      })
      .attr("x",function(d){
        return dayScale(d.key);
      })
      .attr("y",function(d){
        return countScale(d.value)-4;
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
          .text('Day')
          .attr("text-anchor", "middle")
          .attr("transform", "translate("+ plotWidth/2 +","+(plotHeight+40)+ ")")
          .attr("fill","#A64C38");

};
function getRandomColor(d) {
  let color='#449c31';
  if(d.value>=0 && d.value<=1500 ){
    color='#1b4e10';
  }else if(d.value>1500 && d.value<=1700){
    color='#6dc15b';
  }else if(d.value>1700 && d.value<=1900){
    color='#ff3c78';
  }else if(d.value>1900 && d.value<=2000){
    color='#ff3c4b';
  }else{
    color='#a0000d';
  }

    return color;
}
