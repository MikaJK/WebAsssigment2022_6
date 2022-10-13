import { Chart } from "frappe-charts/dist/frappe-charts.esm.js";

const jsonQ = {
  query: [
    {
      code: "Vuosi",
      selection: {
        filter: "item",
        values: [
          "2000",
          "2001",
          "2002",
          "2003",
          "2004",
          "2005",
          "2006",
          "2007",
          "2008",
          "2009",
          "2010",
          "2011",
          "2012",
          "2013",
          "2014",
          "2015",
          "2016",
          "2017",
          "2018",
          "2019",
          "2020",
          "2021"
        ]
      }
    },
    {
      code: "Alue",
      selection: {
        filter: "item",
        values: ["SSS"]
      }
    },
    {
      code: "Tiedot",
      selection: {
        filter: "item",
        values: ["vm11"]
      }
    }
  ],
  response: {
    format: "json-stat2"
  }
};

function $(x) {
  return document.getElementById(x);
}

async function fetchData(query1, query2) {
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
  Promise.all([
    fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(query1)
    }),
    fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(query2)
    })
  ])
    .then((responses) =>
      Promise.all(responses.map((response) => response.json()))
    )
    .then((data) => {
      makeChart(data[1], data[0]);
    })
    .catch((err) => {
      return Promise.reject();
    });
}

async function makeChart(data, data2) {
  const tiedot = Object.values(data.dimension.Tiedot.category.label);
  const vuosi = Object.values(data.dimension.Vuosi.category.label);
  const values = data.value;

  const tiedot2 = Object.values(data2.dimension.Tiedot.category.label);
  const vuosi2 = Object.values(data2.dimension.Vuosi.category.label);
  const values2 = data2.value;

  var test = [];
  var test2 = [];

  vuosi.forEach((value, index) => {
    test.push(values[index]);
  });

  vuosi2.forEach((value, index) => {
    test2.push(values2[index]);
  });

  tiedot[0] = {
    name: tiedot[0],
    values: test
  };
  tiedot.push({
    name: tiedot2[0],
    values: test2
  });

  const chartData = {
    labels: vuosi,
    datasets: tiedot
  };
  console.log(tiedot);

  const chart = new Chart("#second-chart", {
    title: "Data chart",
    data: chartData,
    type: "bar",
    height: 450,
    colors: ["#63d0ff", "#363636"]
  });
  //console.log(chart.data.datasets[0].values);
}

async function start() {
  jsonQ.query[1].selection.values = [localStorage["areacode"]];
  let query2 = JSON.parse(JSON.stringify(jsonQ));
  query2.query[2].selection.values = ["vm01"];

  fetchData(jsonQ, query2);
}

start();
