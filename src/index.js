import "./styles.css";
import { Chart } from "frappe-charts/dist/frappe-charts.esm.js";

/*function change_page(){
  window.location.href = "test.html";
} 


<input type="button" value="create page" onclick="change_page()"/> */

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
        values: ["vaesto"]
      }
    }
  ],
  response: {
    format: "json-stat2"
  }
};
const norm = jsonQ;
let areaData;
let currentAreaCode;

if (document.readyState !== "loading") {
  console.log("Document is ready!");
  startFunction();
} else {
  document.addEventListener("DOMContentLoaded", function (event) {
    event.preventDefault();
    console.log("Document is ready after waiting!");
    startFunction();
  });
}

function $(x) {
  return document.getElementById(x);
}

async function makeChart(data) {
  const tiedot = Object.values(data.dimension.Tiedot.category.label);
  const vuosi = Object.values(data.dimension.Vuosi.category.label);
  const values = data.value;

  //console.log(tiedot);
  //console.log(vuosi);
  //console.log(values);

  var test = [];

  vuosi.forEach((value, index) => {
    test.push(values[index]);
  });

  tiedot[0] = {
    name: tiedot[0],
    values: test
  };

  const chartData = {
    labels: vuosi,
    datasets: tiedot
  };
  console.log(tiedot);

  const chart = new Chart("#chart", {
    title: "Data chart",
    data: chartData,
    type: "line",
    height: 450,
    colors: ["#eb5146", "#743ee2"]
  });
  //console.log(chart.data.datasets[0].values);

  $("add-data").addEventListener("click", function () {
    let datapoint = makeNextDataPoint(chart.data);
    console.log(datapoint);
    chart.addDataPoint(datapoint[0], datapoint[1]);
  });
}

//((2−5)+(4−2)+((−1)−4))/3+(−1)=(2−3−5)/3−1=(−6)/3−1=−3
function makeNextDataPoint(data) {
  let x = 0;
  let indexes = Object.values(data.labels);
  let values = Object.values(data.datasets[0].values);
  indexes.forEach((index) => {
    x++;
  });

  let year = parseInt(data.labels[0]) + x;
  let aggrate = 0;
  values.forEach((value, index) => {
    if (values[index + 1] - value) {
      aggrate += values[index + 1] - value;
      //console.log(values[index + 1] - value);
    }
  });
  aggrate = aggrate / (x - 1) + values[x - 1];
  console.log(year + " " + aggrate);
  let datapoint = [year, [aggrate]];
  return datapoint;
}

function formHandler() {
  var form = $("chart-form");
  $("chart-form").addEventListener("submit", function handleSubmit(event) {
    event.preventDefault();
    var area = $("input-area").value;
    changingJson(checkAreaCode(area, area));
    form.reset();
  });
  $("navigation").addEventListener("click", function () {
    switchWindow();
  });
}

function changingJson(Alue) {
  localStorage.clear();
  if (!Alue) {
    localStorage["areacode"] = ["SSS"];
    jsonQ.query[1].selection.values = ["SSS"];
    fetchData(norm);
  } else {
    localStorage["areacode"] = [Alue];
    console.log(Alue);
    jsonQ.query[1].selection.values = [Alue];
    fetchData(jsonQ);
  }
}

/*{query: Array(3), response: Object}
query: Array(3)
0: Object
1: Object
code: "Alue"
selection: Object
filter: "item"
values: Array(1)
2: Object
response: Object
format: "json-stat2" */

function checkAreaCode(aName) {
  var areaCode = null;
  var areaCodes = areaData.values;
  var areaNames = areaData.valueTexts;
  areaNames.forEach((area, index) => {
    if (area === aName) {
      areaCode = areaCodes[index];
    }
  });
  return areaCode;
}

//used to fetch the area code
async function fetchAreaData() {
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
  let data;
  console.log("fethcing");
  data = fetch(url, {
    method: "GET"
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });
  data.then((res) => {
    areaData = res.variables[1];
    //console.log("areas gotten");
  });
}

async function fetchData(bodyJson) {
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
  let data;
  console.log("fethcing");
  data = fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(bodyJson)
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });
  data.then((res) => {
    //console.log(res);
    makeChart(res);
  });
}

function startFunction() {
  localStorage.clear();
  localStorage["areacode"] = ["SSS"];
  formHandler();
  fetchAreaData();
  fetchData(jsonQ);
}

/*localStorage["key"] = value;

... in another page ...
value = localStorage["key"]; */
function switchWindow() {
  localStorage["test"] = "test";
  window.location.href = "newchart.html";
}
