//Define SVG area dimensions
var svgWidth = 1000;
var svgHeight = 500;

//Define the chart's margins as on object
var margin = {
    top: 20,
    right: 40, 
    bottom: 100, 
    left: 100
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

//Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
        d3.max(healthData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }

//function to update x-axis depending upon what is clicked on
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
}


// function used for updating y-scale var upon click on axis label
function yScale(healthData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
        d3.max(healthData, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  
}
//function to update y-axis depending upon what is clicked on
function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
}
  
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]))
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
}

function renderText(textValues, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  textValues.transition()
    .duration(1000)
    .attr("x", d => (newXScale(d[chosenXAxis]))-6)
    .attr("y", d => (newYScale(d[chosenYAxis]))+4);

  return textValues;
}


//function used for updating circles grup with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, textValues) {
  if (chosenXAxis === "poverty") {
    var labelX = "In Poverty(%)";
  }
  else if (chosenXAxis === "age") {
    var labelX = "Age (Median)";
  } else  {
    var labelX = "Household Income (Median)";
  }
 
  if (chosenYAxis === "obesity") {
    var labelY = "Obesity (%)";
  }
  else if (chosenYAxis === "smokes") {
    var labelY = "Smokes (%)";
  } else  {
    var labelY = "Lacks Healthcare (%)";
  }



var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${labelX}: ${d[chosenXAxis]}<br>${labelY}: ${d[chosenYAxis]}`);
    
 });

 textValues.call(toolTip);

 textValues.on("mouseover", function(data) {
   toolTip.show(data);
 })

  .on("mouseout", function(data) {
    toolTip.hide(data);
  });

 return textValues;
}

d3.csv("data.csv", function(error, healthData) {
    if (error) throw error;
            
              
    healthData.forEach(function(data) {
        //x-axis
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        //y-axis
        data.obesity = data.obesity;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
        });
        console.log(healthData);
    
    
       
        //xLinear Scale function 
        var xLinearScale = xScale(healthData, chosenXAxis);
        var yLinearScale = yScale(healthData, chosenYAxis);

        //create initial axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);


        // append x axis
        var xAxis = chartGroup.append("g")
          .classed("x-axis", true)
          .attr("transform", `translate(0, ${height})`)
          .call(bottomAxis);

        // append y axis
        var yAxis = chartGroup.append("g")
          .classed("y-axis", true)
          .call(leftAxis);


        var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d =>  yLinearScale(d[chosenYAxis]))
        .attr("r", 10)
        .attr("fill", "lightblue")
        .classed("circles", true);
   


     var textValues = chartGroup.selectAll("text.values")
        .data(healthData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => (xLinearScale(d[chosenXAxis]))-6)
        .attr("y", d => (yLinearScale(d[chosenYAxis]))+4)
        .attr("font-size", "10px");
   

       
      // Create group for  3 x- axis labels
      var xLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
    
     
        var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty(%)");

      var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");

      var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");
        

      // Create group for  3 y- axis labels
      var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    
      var obesityLabel = yLabelsGroup.append("text")
        .attr("y", 0 - 20)
        .attr("x", 0 - (height / 2))
        .attr("value", "obesity") // value to grab for event listener
        .classed("active", true)
        .text("Obesity (%)");

      var smokesLabel = yLabelsGroup.append("text")
        .attr("y", 0 - 40)
        .attr("x", 0 - (height / 2))
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smokes (%)");

      var healthcareLabel = yLabelsGroup.append("text")
        .attr("y", 0 - 60)
        .attr("x", 0 - (height / 2))
        .attr("value", "healthcare") // value to grab for event listener
        .classed("inactive", true)
        .text("Lacks Healthcare (%)");

      // updateToolTip function above csv import
      var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

     // x axis labels event listener
      xLabelsGroup.selectAll("text")
        .on("click", function() {
    // get value of selection
      var xvalue = d3.select(this).attr("value");
      if (xvalue !== chosenXAxis)  {
      
      // replaces chosenXAxis with value
        chosenXAxis = xvalue;

       console.log(chosenXAxis)

      // functions here found above csv import
      // updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);

      // updates x axis with transition
      xAxis = renderXAxis(xLinearScale, xAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
      
      textValues = renderText(textValues, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
      
      // updates tooltips with new info
      textValues = updateToolTip(chosenXAxis, chosenYAxis, textValues);
  
      

       // changes classes to change bold text
       if (chosenXAxis === "poverty") {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
       else if (chosenXAxis === "age") {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", true)
          .classed("inactive", false);
       incomeLabel
          .classed("active", false)
          .classed("inactive", true);
    } else {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
       incomeLabel
          .classed("active", true)
          .classed("inactive", false );
      }
    }
    });

 // y axis labels event listener
 yLabelsGroup.selectAll("text")
  .on("click", function() {
// get value of selection
var yvalue = d3.select(this).attr("value");
 
  if (yvalue !== chosenYAxis) {

// replaces chosenXAxis with value
 chosenYAxis = yvalue;


console.log(chosenYAxis)

// functions here found above csv import
// updates x scale for new data
 yLinearScale = yScale(healthData, chosenYAxis);

// updates x axis with transition
 yAxis = renderYAxis(yLinearScale, yAxis);

 // updates circles with new x values
 circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
      
 textValues = renderText(textValues, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
 
 // updates tooltips with new info
 textValues = updateToolTip(chosenXAxis, chosenYAxis, textValues);

// changes classes to change bold text
if (chosenYAxis === "obesity") {
 obesityLabel
   .classed("active", true)
   .classed("inactive", false);
 smokesLabel
   .classed("active", false)
   .classed("inactive", true);
 healthcareLabel
   .classed("active", false)
   .classed("inactive", true);
}
else if (chosenYAxis === "smokes") {
 obesityLabel
   .classed("active", false)
   .classed("inactive", true);
 smokesLabel
   .classed("active", true)
   .classed("inactive", false);
healthcareLabel
   .classed("active", false)
   .classed("inactive", true);
} else {
 obesityLabel
   .classed("active", false)
   .classed("inactive", true);
 smokesLabel
   .classed("active", false)
   .classed("inactive", true);
healthcareLabel
   .classed("active", true)
   .classed("inactive", false);
}
}
});
});



    