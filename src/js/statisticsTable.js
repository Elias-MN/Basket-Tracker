import { DatabaseManager } from "./indexedDB.js";

const dbManager = DatabaseManager.getInstance();
const tableElement = document.getElementById("statisticsTable");

let statistics = [];

function createTable() {

  statistics.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  statistics.forEach(statistic => {
    let row = document.createElement("tr");
    for (let [key, value] of Object.entries(statistic)) {
      let data = document.createElement("td");
      if (key === "tipo") {
        if (value === "shoots2") {
          value = "Tiros de 2";
        }
        if (value === "shoots3") {
          value = "Triples";
        }
      }
      if (key === "id") {
        let deleteButton = document.createElement("button");
        deleteButton.setAttribute("id", value);
        deleteButton.innerText = "Borrar";
        deleteButton.addEventListener("click", event => {
          deleteStatisticDB(event.target.id);
        });
        data.appendChild(deleteButton);
      } else {
        data.innerText = value;
      }
      row.appendChild(data);
    }
    tableElement.appendChild(row)
  });
}

function getStatisticsDB() {

  dbManager.open()
    .then(() => {
      dbManager.getAllData()
        .then(result => {
          statistics = result;
          createTable();
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
  let confirm = window.confirm("¿Estás seguro de que deseas eliminar este dato?");

  if (confirm) {
    dbManager.open()
      .then(() => {
        dbManager.deleteData(parseInt(id))
          .then(result => {
            console.log("Eliminado con éxito");
            resetTable();
            getStatisticsDB();
          })
          .catch((error) => {
            console.error("Error deleteData: " + error);
          });
      })
      .catch((error) => {
        console.error("Error open: " + error);
      });
  }
}

getStatisticsDB();

function resetTable() {
  tableElement.innerHTML = `
  <tr>
    <th>Fecha</th>
    <th>Tipo</th>
    <th>Pts</th>
    <th></th>
  </tr>
`;
}
