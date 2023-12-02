import { DatabaseManager } from "./indexedDB.js";

const dbManager = DatabaseManager.getInstance();
const myChartElement = document.getElementById('myChart');

let shootsList = [];
let shoots3DataList = [];

function setChart() {

  shootsList.forEach(element => {
    let newShoot = { x: element.fecha, y: element.porcentaje, shootID: element.id };
    if (element.tipo == "shoots3") {
      shoots3DataList.push(newShoot);
    }
  });

  shoots3DataList.sort((a, b) => new Date(a.x) - new Date(b.x));

  let myDataset = [
    {
      label: '% Tiros de 3',
      data: shoots3DataList,
      borderWidth: 3,
      borderColor: 'rgb(63, 219, 63)',
      tension: 0.1,
      backgroundColor: "rgb(180, 250, 157)",
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
          shoots3DataList.splice(indexChart, 1);
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

