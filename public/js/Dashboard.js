const myModal = document.getElementById("myModal");
const myInput = document.getElementById("myInput");
const competitorsDiv = $("#competitors");
const finishedDiv = $("#finished");
const ongoingDiv = $("#ongoing");
var hideBt = true
var startTime = null;
var pauseTime = 0;
var finished = 0;
var ongoing = 0;
var paused = false
var modals = {};
// myModal.addEventListener("shown.bs.modal", () => {
//   myInput.focus();
// });

function toggleActivityStart() {
  var button = document.getElementById("toggleButtonStart");
  if(hideBt) {
    document.getElementById("toggleButtonPause").classList.remove("d-none");
    hideBt = false
  }

  if (button.classList.contains("btn-success")) {
      button.classList.remove("btn-success");
      button.classList.add("btn-danger");
      button.innerHTML = "Finalizar Prova";
      startTimer();
  } else {
      button.classList.remove("btn-danger");
      button.classList.add("btn-success");
      button.innerHTML = "Iniciar Prova";
      finishActivity();
  }
}

function toggleActivityPause() {
  var button = document.getElementById("toggleButtonPause");
  pauseTimer()

  if (button.classList.contains("btn-success")) {
      button.classList.remove("btn-success");
      button.classList.add("btn-danger");
      button.innerHTML = "Retomar Prova";
      paused = true
    } else {
      button.classList.remove("btn-danger");
      button.classList.add("btn-success");
      button.innerHTML = "Pausar Prova";
      paused = false
  }
}

function atualizarTempoRestante() {
  $.ajax({
    url: `http://${url}:3000/check-timer`,
    type: "GET",
    success: function (response) {
      $("#tempoRestante").text(response.leftTime);
      startTime = response.startTime
      setInterval(atualizarTempoRestanteFrontend, 1000)
      var button = document.getElementById("toggleButtonStart");
      button.classList.remove("btn-success");
      button.classList.add("btn-danger");
      button.innerHTML = "Finalizar Prova";
      document.getElementById("toggleButtonPause").classList.remove("d-none");

      if(response.paused){
        button = document.getElementById("toggleButtonPause");
        button.classList.remove("d-none");
        button.classList.remove("btn-success");
        button.classList.add("btn-danger");
        button.innerHTML = "Retomar Prova";
        paused = true
        document.getElementById("toggleButtonPause").classList.remove("d-none");
      }
    },
    error: function (xhr, status, error) {
    },
  });
}

function startTimer() {
  $.ajax({
    url: `http://${url}:3000/start-timer`,
    type: "POST",
    success: function (response) {
      startTime = response.startTime; 
      setInterval(atualizarTempoRestanteFrontend, 1000);
    },
    error: function (xhr, status, error) {
      console.log(error);
    },
  });
}

function pauseTimer() {
  $.ajax({
    url: `http://${url}:3000/pause-timer`,
    type: "GET",
    success: function (response) {
      pauseTime = response.pauseTime;
      paused = response.paused
    },
    error: function (xhr, status, error) {
      console.log(error);
    },
  });
}

function finishActivity() {
  $.ajax({
    url: `http://${url}:3000/finish`,
    type: "POST",
    success: function (response) {
      console.log("finalizado");
      paused = true
    },
    error: function (xhr, status, error) {
      console.log(error);
    },
  });
}

setInterval(() => {
  $.ajax({
    url: `http://${url}:3000/competitors`,
    type: "GET",
    success: function (response) {
      var s = Date.now();

      if (Object.keys(response).length > 0) {
        finished = Object.values(response).reduce(
          (counter, { done }) => (done === true ? (counter += 1) : counter),
          0
        );
        ongoing = Object.keys(response).length - finished;

        ongoingDiv.text(ongoing);
        finishedDiv.text(finished);

        for (const [key, value] of Object.entries(response))  {
          var hasChildWithId =
            competitorsDiv.find("#" + value.code).length > 0;
          if (hasChildWithId) {
            value.done
              ? $(`#${value.code}-bg`)
                  .addClass("greenBg")
                  .removeClass("yellowBg")
              : $(`#${value.code}-bg`)
                  .addClass("yellowBg")
                  .removeClass("greenBg");
            $(`#${value.code}-icon`).attr(
              "src",
              value.done
                ? "./assets/icons/checkmark-frame.png"
                : "./assets/icons/alarm-clock.png"
            );
            $(`#${value.code}-done`).text(
              `Status: ${value.done ? "Concluído" : "Executando"}`
            );
            $(`#${value.code}-time`).text(`Tempo: ${value.time}`);
            $(`#${value.code}-w1`).val(value.w1);
            $(`#${value.code}-w2`).val(value.w2);
            $(`#${value.code}-w3`).val(value.w3);
            $(`#${value.code}-w4`).val(value.w4);
            $(`#${value.code}-w5`).val(value.w5);
          } else {
            competitorsDiv.append(`
          <div class="col" id="${value.code}">
          <div class="card">
            <div class="cardHeader ${
              value.done ? "greenBg" : "yellowBg"
            }" id="${value.code}-bg">
              <img class="image-bosch-pattern" src="${
                value.done
                  ? "./assets/icons/checkmark-frame.png"
                  : "./assets/icons/alarm-clock.png"
              }" alt="Bosch color pattern" id="${value.code}-icon" />
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item" id="${value.code}-name">Nome: ${
              value.name
            }
              </li>
              <li class="list-group-item" id="${
                value.code
              }-done">Status: ${value.done ? "Concluído" : "Executando"}
              </li>
              <li class="list-group-item" id="${
                value.code
              }-time">Tempo: ${value.time}
              </li>
              <li class="list-group-item">
                <button type="button" class="btn btn-light btn-resp" data-bs-toggle="modal"
                  data-bs-target="#${value.code}-modal">
                  Respostas
                </button>

                <div class="modal fade" id="${
                  value.code
                }-modal" tabindex="-1" aria-labelledby="${value.code}-Label"
                  aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-header" style="background-color: rgb(247, 247, 247)">
                        <h1 class="modal-title fs-5" id="${value.code}-Label">
                          Respostas
                        </h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body" style="
                          background-color: rgb(247, 247, 247);
                          border-radius: 0px 0px 10px 10px;
                        ">
                        <div class="card mb-5" style="border: 0cap">
                          <div class="card-body card_connected_comp">
                            <div class="card-body">
                              <form action="post" name="form-res" id="form-res">

                                <div class="input-group mt-3 mb-3">
                                  <span class="input-group-text" id="inputGroup-sizing-default"><img
                                    src="../../assets/formas/triangulo.png" class="mini-icon" /></span>
                                  <input disabled value="${
                                    value.w1
                                  }" id="${
              value.code
            }-w1" type="number"  class="form-control"
                                  aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                                </div>

                                <div class="input-group mb-3">
                                  <span class="input-group-text" id="inputGroup-sizing-default"><img
                                      src="../../assets/formas/quadrado.png" class="mini-icon" /></span>
                                  <input disabled value="${
                                    value.w2
                                  }" id="${
              value.code
            }-w2" type="number" class="form-control"
                                  aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                                </div>

                                <div class="input-group mb-3">
                                  <span class="input-group-text" id="inputGroup-sizing-default"><img
                                      src="../../assets/formas/ellipse.png" class="mini-icon" /></span>
                                  <input disabled value="${
                                    value.w3
                                  }" id="${
              value.code
            }-w3" type="number" class="form-control"
                                  aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                                </div>

                                <div class="input-group mb-3">
                                  <span class="input-group-text" id="inputGroup-sizing-default"><img
                                      src="../../assets/formas/star.png" class="mini-icon" /></span>
                                  <input disabled value="${
                                    value.w4
                                  }" id="${
              value.code
            }-w4" type="number" class="form-control"
                                  aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                                </div>

                                <div class="input-group mb-3">
                                  <span class="input-group-text" id="inputGroup-sizing-default"><img
                                      src="../../assets/formas/pentagono.png" class="mini-icon" /></span>
                                  <input disabled value="${
                                    value.w5
                                  }" id="${
              value.code
            }-w5" type="number" class="form-control"
                                  aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
          `);
          }
        }
      }
    },
    error: function (xhr, status, error) {
      console.log(error);
    },
  });
}, 5000);

function atualizarTempoRestanteFrontend() {
  if(paused)
    return
  const elapsedTime = (Date.now() - startTime) - pauseTime;

  const remainingTime = Math.max(0, 3600000 - elapsedTime);

  const horas = Math.floor(remainingTime / 3600000);
  const minutos = Math.floor((remainingTime % 3600000) / 60000);
  const segundos = Math.floor((remainingTime % 60000) / 1000);

  const tempoFormatado = `${horas.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;

  $("#tempoRestante").text(tempoFormatado);
}

$("#saveChanges").on('click', function() {
  $.ajax({
    url: `http://${url}:3000/set-weigths/game`,
    type: "POST",
    data: $("#form-update").serialize(),
    success: function (response) {
      
    },
    error: function (xhr, status, error) {
      console.log("Error:", error);
    },
  });
})

$("#options input").on('click', function() {
  $.ajax({
    url: `http://${url}:3000/setOptions`,
    type: "POST",
    data: $("#options").serialize(),
    success: function (response) {
      
    },
    error: function (xhr, status, error) {
      console.log("Error:", error);
    },
  });
})

atualizarTempoRestante()