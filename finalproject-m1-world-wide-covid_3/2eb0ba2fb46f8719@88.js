// https://observablehq.com/@washingtondacosta/finalproject-m1-world-wide-covid/3@88
import define1 from "./e93997d5089d7165@2303.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
    md`# finalproject #m1- world wide covid`
    )});
  main.variable(observer("viewof choose")).define("viewof choose", ["radio"], function(radio){return(
    radio({
      options: [
      { label: 'Total Cases', value: 'total_cases' },
      { label: 'Total Deaths', value: 'total_deaths'},
      { label: 'Total vaccinations', value: 'total_vaccinations' },
      { label: 'New cases', value: 'new_cases' },
      { label: 'New deaths', value: 'new_deaths' },
      { label: 'New vaccinations', value: 'new_vaccinations' }
      
      ],
      value:'total_cases'
    })
    )});
  main.variable(observer("choose")).define("choose", ["Generators", "viewof choose"], (G, _) => G.input(_));
  main.variable(observer("viewof dateIndex")).define("viewof dateIndex", ["slider","dates"], function(slider,dates){return(
    slider({
      min: 0, 
      max: dates.length-1, 
      step: 1, 
      value: dates.length-1, 
      format: i => `${dates[i]}`,
      title: "Dates", 
    })
    )});
  main.variable(observer("dateIndex")).define("dateIndex", ["Generators", "viewof dateIndex"], (G, _) => G.input(_));
  main.variable(observer()).define(["html","sortedData","date","choose","Plotly","mapLayout"], function(html,sortedData,date,choose,Plotly,mapLayout)
  {
    const myDiv = html`<div/>`;
    const filter_and_unpack = (key, date) =>
    sortedData.filter(row => row['date'] == date).map(row => row[key]);
    const locations = filter_and_unpack('location', date);
    const data = [
    {
      type: 'choropleth',
      z: filter_and_unpack(choose, date),
      locations: locations,
      text: locations,
      locationmode: 'country names',
      autocolorscale: false,
      colorscale: 'YlGnBu',
      reversescale: true
    }
    ];
    var layout = {
      title: `World ${choose} choropleth<br>${date}`,
      showlegend: false,
      geo: {
        scope: 'world',
        showland: true,
        showlakes: true
      }
    };

    Plotly.newPlot(myDiv, data, { ...layout, ...mapLayout }, { showLink: false });
    return myDiv;
  }
  );
  main.variable(observer()).define(["html","d3","sortedData","choose","date","Plotly","mapLayout"], function(html,d3,sortedData,choose,date,Plotly,mapLayout)
  {
    const myDiv = html`<div/>`; 

    const SizeScale = d3
    .scaleSqrt()
    .domain(d3.extent(sortedData, d => d[choose]))
    .range([5, 15]);
    const Size = sortedData.filter(row => row['date'] == date).map(d => SizeScale(d[choose]));
    const filter_and_unpack = (key, date) =>
    sortedData.filter(row => row['date'] == date).map(row => row[key]);
    const hoverText = sortedData.filter(row => row['date'] == date).map(d => d.location+" /" +choose+":"+ d[choose]);

    var data = [
    {
      type: 'scattergeo',
      locationmode: 'country names',
      locations: filter_and_unpack('location', date),
      hoverinfo: 'text',
      text:hoverText,
      marker: {
        size: Size, //Size specified the diameter
        line: {
          color: "lightgrey",
          width: 1
        }
      }
    }
    ];

    var layout = {
      title: `World ${choose} scattergeo <br>${date}`,
      showlegend: false,
      geo: {
        scope: 'world',
        showland: true,
        showlakes: true
      }
    };

    Plotly.newPlot(myDiv, data, { ...layout, ...mapLayout });
    return myDiv;
  }
  );
  main.variable(observer("dates")).define("dates", ["sortedData"], function(sortedData){return(
    [...new Set(sortedData.map(d => d.date))]
    )});
  main.variable(observer("date")).define("date", ["dates","dateIndex"], function(dates,dateIndex){return(
    dates[dateIndex]
    )});
  main.variable(observer("clean_covid_data")).define("clean_covid_data", ["covid_data"], function(covid_data){return(
    covid_data.filter(d => d['iso_code'].length <=3)
    )});
  main.variable(observer("sortedData")).define("sortedData", ["clean_covid_data"], function(clean_covid_data){return(
    clean_covid_data.sort(function(a,b){
      return new Date(a.date) - new Date(b.date);
    })
    )});
  main.variable(observer("covid_data")).define("covid_data", ["d3"], function(d3){return(
    d3.csv(
      "https://covid.ourworldindata.org/data/owid-covid-data.csv"
      )
    )});
  main.variable(observer("mapLayout")).define("mapLayout", function(){return(
    {
      autosize: false,
      width: 900,
      height: 500,
      margin: {
        l: 20,
        r: 50,
        b: 20,
        t: 50,
        pad: 4
      },
      paper_bgcolor: '#fff',
      plot_bgcolor: '#8888c7'
    }
    )});
  main.variable(observer("Plotly")).define("Plotly", ["require"], function(require){return(
    require("https://cdn.plot.ly/plotly-latest.min.js")
    )});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
    require("d3@6")
    )});
  const child1 = runtime.module(define1);
  main.import("radio", child1);
  main.import("select", child1);
  main.import("slider", child1);
  return main;
}
