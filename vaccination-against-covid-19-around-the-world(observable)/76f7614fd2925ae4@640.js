// https://observablehq.com/@washingtondacosta/vaccination-against-covid-19-around-the-world@640
import define1 from "./e93997d5089d7165@2303.js";
import define2 from "./7764a40fe6b83ca1@427.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Vacinação contra covid 19 ao redor do mundo`
)});
  main.variable(observer("viewof choose")).define("viewof choose", ["radio"], function(radio){return(
radio({
  options: [
    { label: 'Total de vacinações', value: 'total_vaccinations' },
    { label: "Parcela da population (%)",value: "total_vaccinations_per_hundred"},
    { label: 'Poluação totalmente vacinada (%)', value: 'percentualVaccinations'},
    { label: 'Vacinações diárias', value: 'new_vaccinations' },
    { label: 'Total de casos', value: 'total_cases' },
    { label: 'Total de mortes', value: 'total_deaths'},
    
  ],
  value:'total_vaccinations'
})
)});
  main.variable(observer("choose")).define("choose", ["Generators", "viewof choose"], (G, _) => G.input(_));
  main.variable(observer("viewof dateIndex")).define("viewof dateIndex", ["slider","dates"], function(slider,dates)
{
  const s = slider({
  min: 0, 
  max: dates.length-1,
  step: 1,
  precision:1,
  value: dates.length-1, 
  format: i => `${dates[i]}`,
  title: "Data para referência <br><small>A visualização ira mudar conforme os dados da data selecionada</small>", 
  });
  s.input.style.width = "80%";
  return s;
}
);
  main.variable(observer("dateIndex")).define("dateIndex", ["Generators", "viewof dateIndex"], (G, _) => G.input(_));
  main.variable(observer("Data_de_referência")).define("Data_de_referência", ["date"], function(date){return(
`${date}`
)});
  main.variable(observer("map1")).define("map1", ["html","sortedData","date","choose","location","Plotly","mapLayout"], function(html,sortedData,date,choose,location,Plotly,mapLayout)
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
      text: location,
      locationmode: 'country names',
      autocolorscale: false,
      colorscale: 'YlGnBu',
      reversescale: true
    }
  ];
  var layout = {
    //title: `Day view: ${date}`,
    showlegend: false,
    geo: {
      scope: 'world',
    }
  };
  Plotly.newPlot(myDiv, data, { ...layout, ...mapLayout }, { showLink: false });
  return myDiv;
}
);
  main.variable(observer("map2")).define("map2", ["html","d3","sortedData","choose","date","Plotly","mapLayout"], function(html,d3,sortedData,choose,date,Plotly,mapLayout)
{
  const myDiv2 = html`<div/>`; 

  const SizeScale = d3
    .scaleSqrt()
    .domain(d3.extent(sortedData, d => d[choose]))
    .range([5, 10]);
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
    //title: `Day view: ${date}`,
    showlegend: false,
    geo: {
      scope: 'world',
    }
  };

  Plotly.newPlot(myDiv2, data, { ...layout, ...mapLayout });
  return myDiv2;
}
);
  main.variable(observer("titleLineChart")).define("titleLineChart", ["md","choose"], function(md,choose){return(
md`### Evolution around the world in ${choose}`
)});
  main.variable(observer("viewof linechart")).define("viewof linechart", ["vl","sortedData","choose"], function(vl,sortedData,choose){return(
vl.markLine()
  .width(800)
  .data(sortedData)                        
  .encode(
    vl.x().fieldT("date"),      
    vl.y().fieldQ(choose), 
    vl.tooltip().field(choose)       
  ) .render()
)});
  main.variable(observer("linechart")).define("linechart", ["Generators", "viewof linechart"], (G, _) => G.input(_));
  main.variable(observer("LineChart")).define("LineChart", ["md"], function(md){return(
md`##### LineChart`
)});
  main.variable(observer("viewof heatmap")).define("viewof heatmap", ["vl","sortedData","choose"], function(vl,sortedData,choose){return(
vl.markRect()
  .width(700)
  .data(sortedData)
  .encode(
    vl.y().fieldO("date").timeUnit("utcmonth"),
    vl.x().fieldO("date").timeUnit("utcdate"),
    vl.color().sum(choose).scale({ scheme: "redyellowblue", reverse: true }),
  )
  .render()
)});
  main.variable(observer("heatmap")).define("heatmap", ["Generators", "viewof heatmap"], (G, _) => G.input(_));
  main.variable(observer("Heatmap")).define("Heatmap", ["md"], function(md){return(
md`##### Heatmap`
)});
  main.variable(observer("dates")).define("dates", ["sortedData"], function(sortedData){return(
[...new Set(sortedData.map(d => d.date))]
)});
  main.variable(observer("date")).define("date", ["dates","dateIndex"], function(dates,dateIndex){return(
dates[dateIndex]
)});
  main.variable(observer("filtered_covid_data")).define("filtered_covid_data", ["dataset"], function(dataset){return(
dataset.filter(d => d['iso_code'].length <=3)
)});
  main.variable(observer("sortedData")).define("sortedData", ["filtered_covid_data"], function(filtered_covid_data){return(
filtered_covid_data.sort(function(a,b){
  return new Date(a.date) - new Date(b.date)-1;
})
)});
  main.variable(observer("bubbleChart")).define("bubbleChart", ["d3","width","height","trend","choose","format"], function(d3,width,height,trend,choose,format)
{
  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height + 245])
    .style('background-color', "#fff");

  // Chart (part1)

  let dd = 1;
  let xstart = 10;
  let l = (width - 20) / trend.length;
  let h = height;

  for (let i = 0; i < trend.length; i++) {
    svg
      .append("rect")
      .attr("x", xstart + i * l)
      .attr(
        "y",
        1100 -
          (+trend[i]["total_vaccinations"] /
            +trend[trend.length - 1]["total_vaccinations"]) *
            h
      )
      .attr("width", l)
      .attr(
        "height",
        (+trend[i]["total_vaccinations"] /
          +trend[trend.length - 1]["total_vaccinations"]) *
          h
      )
      .attr("fill", "#fff")
      .attr("stroke", "#fff");
  }
  //

  var defs = svg.append("defs");

  const pattern = defs
    .append("pattern")
    .attr("id", "hatch")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", 6)
    .attr("height", 6);

  pattern
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 6)
    .attr("y1", 6)
    .attr("stroke", "#f4f4f4")
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 0.4);

  svg
    .append("rect")
    .attr("fill-opacity", 0.4)
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height + 385)
    .attr('fill', "url('#hatch')");

  //let title = "Quantidade de pessoas que receberam a vacina";
  svg
    .append("text")
    .attr("y", 48)
    .attr("x", width / 2)
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("font-weight", "bold")
    .attr("fill", "#26272b")
    .style("font-size", "33px")
    //.text(title);

  svg
    .append("text")
    .attr("y", 72)
    .attr("x", width / 2)
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("fill", "#60A7B9")
    .style("font-size", "17px")
    
  svg
    .append("text")
    .attr("y", 1120)
    .attr("x", width / 2)
    .attr("text-anchor", "middle")

    .attr("font-family", "sans-serif")
    .attr("fill", "#787878")
    .style("font-size", "12px")

  svg
    .append("text")
    .attr("y", 1135)
    .attr("x", width / 2)
    .attr("text-anchor", "middle")

    .attr("font-family", "sans-serif")
    .attr("fill", "#787878")
    .style("font-size", "12px")

  svg
    .append("text")
    .attr("y", 1128)
    .attr("x", 10)
    .attr("font-family", "sans-serif")
    .attr("fill", "#787878")
    .style("font-size", "18px")
    .text("from " + trend[0]["date"]);

  svg
    .append("text")
    .attr("y", 1128)
    .attr("x", width - 10)
    .attr("font-family", "sans-serif")
    .attr("fill", "#787878")
    .attr("text-anchor", "end")
    .style("font-size", "18px")
    .text("to " + trend[trend.length - 1]["date"]);

  let txt =
    choose == "total_vaccinations" ? "WORLD: " + format(trend[trend.length - 1][choose]) + " doses" : "WORLD: " + format(trend[trend.length - 1][choose])
  
    choose == "percentualVaccinations" ? "WORLD: " + format(trend[trend.length - 1][choose]) + " %" : "WORLD: " + format(trend[trend.length - 1][choose])

  svg
    .append("text")
    .attr("y", 1015)
    .attr("x", width / 2)
    .attr("font-family", "sans-serif")
    .attr("fill", "#26272b")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .style("font-size", "25px")
    .text(txt);

  const x = svg.append("g").attr('id', 'bubble-chart');
  
  return svg.node();
}
);
  main.variable(observer("renderBubbleChartContainer")).define("renderBubbleChartContainer", ["renderBubbleChart","data","md"], function(renderBubbleChart,data,md)
{
  renderBubbleChart("#bubble-chart", data);
  return md`Bubble chart container`;
}
);
  main.variable(observer("order")).define("order", function(){return(
"desc"
)});
  main.variable(observer("format")).define("format", ["d3"], function(d3){return(
value => {
  const newValue = d3.format("0.2s")(value);

  if (newValue.indexOf('m') > -1) {
    return parseInt(newValue.replace('m', '')) / 1000;
  }

  return newValue;
}
)});
  main.variable(observer("textComponent")).define("textComponent", function(){return(
({
  key,
  text,
  x = 0,
  y = 0,
  fontWeight = 'bold',
  fontSize = '14px',
  textAnchor = 'middle',
  fillOpacity = 1,
  colour,
  r,
  duration = 1000
}) => {
  return {
    append: 'text',
    key,
    text,
    x,
    y,
    textAnchor,
    fontFamily: 'sans-serif',
    fontWeight,
    fontSize,
    fillOpacity: { enter: fillOpacity, exit: 0 },
    fill: colour,
    duration,
    style: {
      pointerEvents: 'none'
    }
  };
}
)});
  main.variable(observer("labelComponent")).define("labelComponent", ["textComponent","format"], function(textComponent,format){return(
({ isoCode, countryName, value, r, colour }) => {
  
  if (r < 12) {
    return [];
  }

  const circleWidth = r * 2;
  const nameWidth = countryName.length * 10;
  const shouldShowIso = nameWidth > circleWidth;
  const newCountryName = shouldShowIso ? isoCode : countryName;
  const shouldShowValue = r > 18;

  let nameFontSize;

  if (shouldShowValue) {
    nameFontSize = shouldShowIso ? '12px' : '18px';
  } else {
    nameFontSize = '8px';
  }

  return [
    textComponent({
      key: isoCode,
      text: newCountryName,
      fontSize: nameFontSize,
      y: shouldShowValue ? '-0.2em' : '0.3em',
      fillOpacity: 1,
      colour
    }),
    ...(shouldShowValue
      ? [
          textComponent({
            key: isoCode,
            text: format(value),
            fontSize: '12px',
            y: shouldShowIso ? '0.9em' : '1.0em',
            fillOpacity: 0.7,
            colour
          })
        ]
      : [])
  ];
}
)});
  main.variable(observer("circleComponent")).define("circleComponent", function(){return(
({
  key,
  r,
  cx,
  cy,
  fill,
  randomDelay = Math.random() * 300
}) => {
  return {
    append: 'circle',
    key,
    r: { enter: r, exit: 0 },
    cx,
    cy,
    fill,
    duration: 1000,
    // Add some randomness movement of circles
    delay: randomDelay
  };
}
)});
  main.variable(observer("bubbleComponent")).define("bubbleComponent", ["width","height","circleComponent","labelComponent"], function(width,height,circleComponent,labelComponent){return(
({
  name,
  id,
  value,
  r,
  x,
  y,
  fill,
  colour,
  duration = 1000
}) => {
  return {
    append: 'g',
    key: id,
    transform: {
      enter: `translate(${x},${y + 75})`,
      exit: `translate(${width / 2},${height / 2})`
    },
    duration,
    delay: Math.random() * 300,
    children: [
      circleComponent({ key: id, r, fill, duration }),
      ...labelComponent({
        key: id,
        countryName: name,
        isoCode: id,
        value,
        r,
        colour,
        duration
      })
    ]
  };
}
)});
  main.variable(observer("renderBubbleChart")).define("renderBubbleChart", ["pack","bubbleComponent","render"], function(pack,bubbleComponent,render){return(
(selection, data) => {
  const root = pack(data);

  const renderData = root.leaves().map(d => {
    return bubbleComponent({
      id: d.data.id,
      name: d.data.name,
      value: d.data.value,
      r: d.r,
      x: d.x,
      y: d.y,
      fill: d.data.fill,
      colour: d.data.colour
    });
  });

  return render(selection, renderData);
}
)});
  main.variable(observer("trend")).define("trend", ["dataset"], function(dataset){return(
dataset.filter(d => d.iso_code == "OWID_WRL")
)});
  main.variable(observer("data")).define("data", ["d3","dataset","choose","order"], function(d3,dataset,choose,order)
{
  let data = d3
    .rollups(
      dataset,
      v => ({
        id: d3.max(v, d => d.iso_code),
        name: d3.max(v, d => d.location),
        date: d3.max(v, d => d.date),
        value: d3.max(v, d => +d[choose]),
        fill: "#60A7B9",
        colour: "#3d3c3b"
      }),
      d => d.location
    )
    .filter(d => d[0] != "World")
    .filter(d => d[0] != "Scotland")
    .filter(d => d[0] != "Wales")
    .filter(d => d[0] != "Northern Ireland")
    .filter(d => d[0] != "England");

  let arr = [];
  data.forEach(function(d) {
    arr.push(d[1]);
  });

  arr.sort(function(a, b) {
    const mod = order === 'desc' ? -1 : 1;
    return mod * (a.value - b.value);
  });

  return arr;
}
);
  main.variable(observer("dataset")).define("dataset", ["d3"], function(d3){return(
d3.csv("https://covid.ourworldindata.org/data/owid-covid-data.csv").then(function(data){
  let parseDate = d3.utcParse("%Y-%m-%d")
  data.forEach(function(d){
    d.percentualVaccinations = +d.people_fully_vaccinated*100/d.population
  });
  return data;
})
)});
  main.variable(observer("mapLayout")).define("mapLayout", function(){return(
{
  autosize: true,
  width: 900,
  height: 500,
  margin: {
    l: 20,
    r: 20,
    b: 20,
    t: 40,
    pad: 4
  },
  paper_bgcolor: '#fff',
  plot_bgcolor: '#8888c7'
}
)});
  main.variable(observer("Plotly")).define("Plotly", ["require"], function(require){return(
require("https://cdn.plot.ly/plotly-latest.min.js")
)});
  main.variable(observer("height")).define("height", function(){return(
900
)});
  main.variable(observer("pack")).define("pack", ["d3","width","height"], function(d3,width,height){return(
data =>
  d3
    .pack()
    .size([width - 2, height - 2])
    .padding(2)(d3.hierarchy({ children: data }).sum(d => d.value))
)});
  main.variable(observer("d3Render")).define("d3Render", ["require"], function(require){return(
require('d3-render@v0.2.4')
)});
  main.variable(observer("render")).define("render", ["d3Render"], function(d3Render){return(
d3Render.default
)});
  main.variable(observer("dc")).define("dc", ["require"], function(require){return(
require('dc')
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  const child1 = runtime.module(define1);
  main.import("radio", child1);
  main.import("select", child1);
  main.import("slider", child1);
  const child2 = runtime.module(define2);
  main.import("vl", child2);
  return main;
}
