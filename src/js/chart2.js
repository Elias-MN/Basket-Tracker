import { DatabaseManager } from "./indexedDB.js";

const dbManager = DatabaseManager.getInstance();
const myChartElement = document.getElementById('myChart');

let shootsList = [];
let shoots2DataList = [];

function setChart() {

  shootsList.forEach(element => {
    let newShoot = { x: element.fecha, y: element.porcentaje, shootID: element.id };
    if (element.tipo == "shoots2") {
      shoots2DataList.push(newShoot);
    }
  });

  shoots2DataList.sort((a, b) => new Date(a.x) - new Date(b.x));

  let myDataset = [
    {
      label: '% Tiros de 2',
      data: shoots2DataList,
      borderWidth: 3,
      borderColor: 'rgb(239, 154, 56)',
      tension: 0.1,
      backgroundColor: "rgb(250, 228, 157)",
      borderCapStyle: 'butt',
      borderDash: [5, 5]
    }
  ];

  let myOptions = {
    onClick: function (event, elements) {
      if (elements.length > 0) {
        let confirm = window.confirm("¿Estás seguro de que deseas eliminar este dato?");
        if (confirm) {
          let indexChart = elements[0].index;
          let indexDB = elements[0].element.$context.raw.shootID;
          shoots2DataList.splice(indexChart, 1);
          myChart.update();
          deleteStatisticDB(indexDB);
        }
      }
    },
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

function deleteStatisticDB(id) {
  dbManager.open()
    .then(() => {
      dbManager.deleteData(id)
        .then(result => {
          console.log("Eliminado con éxito");
        })
        .catch((error) => {
          console.error("Error deleteData: " + error);
        });
    })
    .catch((error) => {
      console.error("Error open: " + error);
    });

}

getStatisticsDB();

