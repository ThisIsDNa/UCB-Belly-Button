//---------------------------------------------------------------------------
// 1/5/2019 - Create a f(x) where: (1) fetches metdata for a sample using 'd3.json'
//                                 (2) clears existing metadata using '.html("")'              
//                                 (3) add key + value pairs to the panel using 'Object.entries'
// 1/5/2019 - Add a Gauge chart using 'buildGauge(data.WFREQ)'?
//            Probably use bonus.js to build it
// 1/5/2019 - Used plotly example to create buildGauge(wfreq) f(x) in bonus.js
//---------------------------------------------------------------------------

function buildMetadata(sample) {
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(sample){
    var sample_metadata = d3.select("#sample-metadata");
    sample_metadata.html("");
    Object.entries(sample).forEach(function ([key, value]) {
      var row = sample_metadata.append("h5");
      row.text(`${key}: ${value}`);
    });
  }
)};

//----------------------------------------------------------------------------------------------
// 1/5/2019 - Create a f(x) where: (1) fetches sample data for plots using 'd3.json'
//                                 (2) build a Bubble Chart using the sample data   
//                                     (a) use 'sample_values' as the values for the pie chart
//                                     (b) use 'otu_ids' as the labels for the pie chart
//                                     (c) use 'otu_labels' as the hovertext for the chart          
//                                 (3) build a Pie Chart using 'slice()' to grab top 10 of: 
//                                     sample_values, otu_ids, and labels                                    
//
//----------------------------------------------------------------------------------------------

function buildCharts(sample) {
  var url = `/samples/${sample}`;   
  d3.json(url).then(function(data) {  
    var pie_values = data.sample_values.slice(0,10);
    var pie_labels = data.otu_ids.slice(0,10);
    var pie_hover = data.otu_labels.slice(0,10);

    var data = [{
      values: pie_values,
      labels: pie_labels,
      hovertext: pie_hover,
      colorscale: 'Blackbody',
      type: 'pie'
    }];

    var layout = {
      xaxis: { title: "Pie Chart"},
      height: 400,
      width: 500
    };

    Plotly.newPlot('pie', data), layout;

  d3.json(url).then(function(data) {
    var x_values = data.otu_ids;
    var y_values = data.sample_values;
    var m_size = data.sample_values;
    var m_colors = data.otu_ids; 
    var t_values = data.otu_labels;
    
    var data = [{
      x: x_values,
      y: y_values,
      text: t_values,
      colorscale: 'Blackbody',
      mode: 'markers',
      marker: {
        color: m_colors,
        size: m_size
      }
    }];
  
    var layout = {
      xaxis: { title: "Bubble Chart"},
      height: 400,
      width: 500
    };
  
  Plotly.newPlot('bubble', data, layout);

    });
  });   
}

//----------------------------------------------------------------------------------------------
// 1/5/2019 - Use given f(x) where it: (1) grabs a reference to the dropdown select element
//                                     (2) uses the list of sample names to populate the select options   
//                                     (3) uses the first sample from the list to build the initial plots                                 
//
//----------------------------------------------------------------------------------------------

function init() {
  var selector = d3.select("#selDataset");
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

init();
