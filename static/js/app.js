    //read data and build data reader
    function buildTable(sample) {
      d3.json("samples.json").then((data) => {
        var sampleData = data.metadata;
        var newData= sampleData.filter(object => object.id == sample);
        var result = newData[0];
        var Data = d3.select("#sample-metadata");
        Data.html("");

        Object.entries(result).forEach(([key, value]) => {
          Data.append("h6").text(`${key}: ${value}`);
        });

      });
    }
    
    //build bar chart and bubble chart
    function buildBar(sample) {
      d3.json("samples.json").then((data) => {
        var sampleData = data.samples;
        var newData = sampleData.filter(object => object.id == sample);
        var result = newData[0];
        var idsData = result.otu_ids;
        var label = result.otu_labels;
        var value = result.sample_values;
        var layout = {
          title: "Bacteria Bubble Chart",
          xaxis: { title: "otu_id" },
        };
        var Data = [
          {
            x: idsData,
            y: value,
            text: label,
            mode: "markers",
            marker: {
              size: value,
              color: idsData,
            }
          }
        ];
        Plotly.newPlot("bubble", Data, layout);
        var value2 = idsData.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var Data2 = [
          {
            y: value2,
            x: value.slice(0, 10).reverse(),
            text: label.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
          }
        ];
        var Layout2 = {
          title: "Top 10 Bacterias in Belly Button",
        };
        Plotly.newPlot("bar", Data2, Layout2);
      });
    }
    function init() {
      var select = d3.select("#selDataset");
      d3.json("samples.json").then((data) => {
        var names = data.names;
        names.forEach((sample) => {
          select
            .append("option")
            .text(sample)
            .property("value", sample);
        });
        //build default page to show 
        var defaultDisplay = names[0];
        buildBar(defaultDisplay);
        buildTable(defaultDisplay);
      });
    }
    //change charts when new selections are made
    function onchange(reselection) {
      buildBar(reselection);
      buildTable(reselection);
    }
    init();