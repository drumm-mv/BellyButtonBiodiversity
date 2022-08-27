function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
};

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesData = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samplesData.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var samplesResult = samplesArray[0];
    // console.log(samplesResult);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = samplesResult.otu_ids;
    var otu_labels = samplesResult.otu_labels;
    var sample_values = samplesResult.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0, 10).reverse().map(row => `OTU ${row} `);

    // 8. Create the trace for the bar chart.    
    var barData = [{
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
      marker: {
        color: '#000000',
        opacity: 0.6
      }
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      font: {
        color: '#ffffff',
      },
      title: "Top 10 Bacteria Cultures Found",
      autosize: false,
      width: 500,
      height: 500,
      paper_bgcolor: "rgba(0,0,0,0)",  
      margin: {
        l: 150,
        r: 150,
        t: 50,
        b: 150,
        pad: 4
      }  
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // console.log(otu_ids);
    // console.log(otu_labels);
    // console.log(sample_values);
    var sizeref_x = 0.8;
    if (sample_values.slice(0) < 11) {
      sizeref_x = 0.1;
    };

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      // hoverinfo: 'text',
      mode: 'markers',
      marker: {
        autocolorscale: false,
        showscale: true,
        color: otu_ids,
        colorscale: 'Earth',
        size: sample_values,
        sizeref: sizeref_x
        // sizemode: 'area'    
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {
        title: 'OTU ID'
        },
      showlegend: false,
      height: 500,
      width: 1200,
      margin: {
        l: 50, 
        r: 50,
        t: 50, 
        b: 100,
        pad: 4
      },
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);


    // Create a variable that holds the samples array. 
    // Create a variable that filters the samples for the object with the desired sample number.

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    // Create a variable that holds the first sample in the array.  
    // 2. Create a variable that holds the first sample in the metadata array.
    var metadataArray = data.metadata;
    var metaResult = metadataArray.filter(sampleObj => sampleObj.id == sample).slice(0);
    console.log(metaResult)

    // 3. Create a variable that holds the washing frequency.
    var washFreq = 0.00
    washFreq = metaResult[0].wfreq
    console.log(washFreq)

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      title: {
        text: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week',
        font: {
          color: '#ffffff',
        },
      },
      domain: { x: [0, 1], y: [0, 1] },
      value: washFreq,
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {
          range: [null, 10]
        },
        bar: { color: "white" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" }
        ],
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      font: {
        color: '#ffffff',
      },
      width: 500,
      height: 500,
      paper_bgcolor: "rgba(0,0,0,0)",
      margin: {
        l: 50, 
        r: 50,
        t: 25, 
        b: 100,
        pad: 4
      },
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
