
// BUILD THE SAMPLE META DATA

function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var metasample_url = "/metadata/" + sample;
    
    console.log(metasample_url);
    
    // HTML has the 'table class to build within the panel
    var table = d3.select("table")
    var tbody = d3.select("tbody")

    // Use `.html("") to clear any existing metadata
    tbody.html("");

    // Use `Object.entries` to add each key and value pair to the panel    
    // tags for each key-value in the metadata.
    d3.json(metasample_url).then(function(m) {
      
      Object.entries(m).forEach(([key,value]) => {
       var row = tbody.append("tr");
       the_key = key.toUpperCase()
       console.log(`Key: ${key} and Value ${value}`);
       row.append("td").text(`${the_key} : ${value}`);
          
      })
     
    })
    console.log("did meta show up above");
     
};

function buildCharts(sample) {

// Use `d3.json` to fetch the sample data for the plots
  var pie_url = "/samples/" + sample;
  console.log(pie_url);
   d3.json(pie_url).then(function(s) {
   
   const pie_values = s.sample_values;
   console.log(pie_values);
   
   const pie_labels = s.otu_ids;
   const pie_textlabels = s.otu_labels;
   
   // Build a Pie Chart
   var trace = [{
   
      values: pie_values.slice(0,10),
      labels: pie_labels.slice(0,10),
      type: "pie",
      hole: .30,
      marker: {
        colors: ['forrestgreen','#12616b','violet','#bf4239','pink','blue','#8e9923','gray','#cc2cc9','orange'],
        line: {
          color: 'vanilla',
          width: 5
        }
      },
      textfont: {
        family: 'Lato',
        color: 'white',
        size: 16
      },
      hovertext : [pie_textlabels],
      
      hoverinfo : 'label+value+percent+text',
      hoverlabel: {
        bgcolor: 'black',
        bordercolor: 'black',
        font: {
          family: 'Lato',
          color: 'white',
          size: 16
        }
      }
    
      
    }];
  
    var layout = {
      height: 550,
      width: 700,
    // legend: {bordercolor: 'lightgray',
    // borderwidth: 3,
    // name: "OTU Ids"
    // },
     title: "Percentage of OTU Bacteria types (Ids) <br> found within the Sample"
    };
  
    Plotly.newPlot("pie", trace, layout);


// Build a Bubble Chart

var trace1 = {
  x: pie_labels,
  y: pie_values,
  mode: 'markers',
  marker: {
    size: pie_values,
    color: pie_labels
  },
  text : pie_textlabels,
  hoverinfo : 'x+y+text'
 
};

var data = [trace1];

var layout = {
  title: 'OTU Bacteria Ids by Bacteria Count found',
  showlegend: false,
  height: 600,
  width: 1000,
  yaxis: {
    automargin: true,
    title: "Bacteria Count <br>"
  },
  xaxis: {
    automargin: true,
    title: "<br> OTU Bacteria Id"
  }


};

Plotly.newPlot('bubble', data, layout);



  });

}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
