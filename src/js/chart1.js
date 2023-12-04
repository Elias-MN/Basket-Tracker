import { DatabaseManager } from "./indexedDB.js";

const dbManager = DatabaseManager.getInstance();
const myChartElement = document.getElementById('myChart');

let shootsList = [];
let shootsDataList = [];

function setChart() {

  shootsList.forEach(element => {
    let newShoot = { x: element.fecha, y: element.porcentaje, shootID: element.id };
    if (element.tipo == "shoots1") {
      shootsDataList.push(newShoot);
    }
  });

  shootsDataList.sort((a, b) => new Date(a.x) - new Date(b.x));

  let myDataset = [
    {
      label: '% Tiros libres',
      data: shootsDataList,
      borderWidth: 3,
      borderColor: 'rgb(239, 154, 56)',
      tension: 0.1,
      backgroundColor: "rgb(250, 228, 157)",
      borderCapStyle: 'butt',
      borderDash: [5, 5],
      pointStyle: 'circle',
      pointRadius: 7,
      pointHoverRadius: 10
    }
  ];

  let myOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 100,
        stepSize: 5
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }

  let myChart = new Chart(myChartElement, {
    type: 'line',
    data: {
      datasets: myDataset
    },
    options: myOptions
  });

}

function getStatisticsDB() {

  dbManager.open()
    .then(() => {
      dbManager.getAllData()
        .then(result => {
          shootsList = result;
          setChart();
        })
        .catch((error) => {
          console.error("Error addData: " + error);
        });
    })
    .catch((error) => {
      console.error("Error open: " + error);
    });

}

getStatisticsDB();

