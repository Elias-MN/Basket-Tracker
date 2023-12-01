import { DatabaseManager } from "./indexedDB.js";

const dbManager = DatabaseManager.getInstance();
const myChart2 = document.getElementById('myChart2');
const myChart3 = document.getElementById('myChart3');

let shootsList = [];

function getShoots() {

  dbManager.open()
    .then(() => {
      dbManager.getAllData()
        .then(result => {
          console.log(result);
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

function setChart() {

  let shoots2DataList = [];
  let shoots3DataList = [];

  shootsList.forEach(element => {
    let newShoot = { x: element.fecha, y: element.porcentaje };
    if (element.tipo == "shoots2") {
      shoots2DataList.push(newShoot);
    }
    if (element.tipo == "shoots3") {
      shoots3DataList.push(newShoot);
    }
  });

  shoots2DataList.sort((a, b) => new Date(a.x) - new Date(b.x));
  shoots3DataList.sort((a, b) => new Date(a.x) - new Date(b.x));

  let mydataset2 = [
    {
      label: '% Tiros de 2',
      data: shoots2DataList,
      borderWidth: 3,
      borderColor: 'rgb(219, 146, 63)',
      tension: 0.1,
      backgroundColor: "rgb(250, 206, 157)",
      borderCapStyle: 'butt',
      borderDash: [5, 5]
    }
  ];

  let mydataset3 = [
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

  let myoptions = {
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

  new Chart(myChart2, {
    type: 'line',
    data: {
      datasets: mydataset2
    },
    options: myoptions
  });

  new Chart(myChart3, {
    type: 'line',
    data: {
      datasets: mydataset3
    },
    options: myoptions
  });
}

getShoots();

