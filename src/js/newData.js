import { DatabaseManager } from "./indexedDB.js";

const dbManager = DatabaseManager.getInstance();

const formElement = document.getElementById("shootsForm");
const dateElement = document.getElementById("date");
const shootElement = document.getElementById("shoot");
const round1Element = document.getElementById("round1");
const round2Element = document.getElementById("round2");
const round3Element = document.getElementById("round3");
const round4Element = document.getElementById("round4");
const round5Element = document.getElementById("round5");

formElement.addEventListener("submit", event => {
  event.preventDefault();
  let percentage = +round1Element.value + +round2Element.value + +round3Element.value + +round4Element.value + +round5Element.value;
  let shoot = { "fecha": dateElement.value, "tipo": shootElement.value, "porcentaje": percentage };
  addShoots(shoot)
})

async function addShoots(data) {

  dbManager.open()
    .then(() => {
      dbManager.addData(data)
        .then(() => {
          window.location.href = '../../index.html';
          // TODO: Reiniciar form en lugar de redireccionar
        })
        .catch((error) => {
          console.error("Error addData: " + error);
        });
    })
    .catch((error) => {
      console.error("Error open: " + error);
    });

}
