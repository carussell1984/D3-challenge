
//Define SVG area dimensions
var svgWidth = 1000;
var svgHeight = 500;

//Define the chart's margins as on object
var margin = {
    top: 60,
    right: 60, 
    bottom: 60, 
    left: 60
};

//Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//append a group area, then set it's margins
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// load the data & then Parse Data and cast as numbers

d3.csv("data.csv", function(error, healthData) {
  if (error) throw error;
  
    
    healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      console.log(data.abbr)
    });
    console.log(healthData);
//    
    //Create scales for %poverty vs. %healthcare chart
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.poverty)*.8, (d3.max(healthData, d => d.poverty)*1.1)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.healthcare)*.8, (d3.max(healthData, d => d.healthcare)*1.1)])
        .range([height, 0]);

    //create axis for the chart
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append the axis to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
        .call(leftAxis);
    


    chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d =>  yLinearScale(d.healthcare))
        .attr("r", 10)
        .attr("fill", "lightblue")
        .classed("circles", true);
   


    chartGroup.selectAll("text.values")
        .data(healthData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => (xLinearScale(d.poverty))-6)
        .attr("y", d => (yLinearScale(d.healthcare))+4)
        .attr("font-size", "10px");
   


        // append y-axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height-125))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("% Lacking Healthcare By State");

      //append x-axis
    chartGroup.append("text")
        .attr("transform", `translate(${width-450}, ${height+40})`)
        .classed("axis-text", true)
        .text("% Poverty by State");
        



    
    // var toolTip = svg.append("div")
    //     .attr("class", "tooltip");

    // circlesGroup.on("mouseover", function(d , i) {  
    //     toolTip.style("display", "block");
    //     toolTip.html("")

    // })

  });




    