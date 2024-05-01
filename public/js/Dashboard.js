const myModal = document.getElementById("myModal");
const myInput = document.getElementById("myInput");
const competitorsDiv = $("#competitors");
const finishedDiv = $("#finished");
const ongoingDiv = $("#ongoing");
var startTime = null;
var finished = 0;
var ongoing = 0;
var modals = {};
// myModal.addEventListener("shown.bs.modal", () => {
//   myInput.focus();
// });

function atualizarTempoRestante() {
  $.ajax({
    url: `http://${url}:3000/check-timer`,
    type: "GET",
    success: function (response) {
      $("#tempoRestante").text(response);
    },
    error: function (xhr, status, error) {
      console.log("Error:", error);
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

setInterval(() => {
  $.ajax({
    url: `http://${url}:3000/competitors`,
    type: "GET",
    success: function (response) {
      var s = Date.now();

      if (response.length > 0) {
        finished = response.reduce(
          (counter, { done }) => (done === true ? (counter += 1) : counter),
          0
        );
        ongoing = response.length - finished;

        ongoingDiv.text(ongoing);
        finishedDiv.text(finished);

        for (let i = 0; i < response.length; i++) {
          var hasChildWithId =
            competitorsDiv.find("#" + response[i].code).length > 0;
          if (hasChildWithId) {
            response[i].done
              ? $(`#${response[i].code}-bg`)
                  .addClass("greenBg")
                  .removeClass("yellowBg")
              : $(`#${response[i].code}-bg`)
                  .addClass("yellowBg")
                  .removeClass("greenBg");
            $(`#${response[i].code}-icon`).attr(
              "src",
              response[i].done
                ? "./assets/icons/checkmark-frame.png"
                : "./assets/icons/alarm-clock.png"
            );
            $(`#${response[i].code}-done`).text(
              `Status: ${response[i].done ? "Concluído" : "Executando"}`
            );
            $(`#${response[i].code}-time`).text(`Tempo: ${response[i].time}`);
            $(`#${response[i].code}-w1`).val(response[i].w1);
            $(`#${response[i].code}-w2`).val(response[i].w2);
            $(`#${response[i].code}-w3`).val(response[i].w3);
            $(`#${response[i].code}-w4`).val(response[i].w4);
            $(`#${response[i].code}-w5`).val(response[i].w5);
          } else {
            competitorsDiv.append(`
          <div class="col" id="${response[i].code}">
          <div class="card">
            <div class="cardHeader ${
              response[i].done ? "greenBg" : "yellowBg"
            }" id="${response[i].code}-bg">
              <img class="image-bosch-pattern" src="${
                response[i].done
                  ? "./assets/icons/checkmark-frame.png"
                  : "./assets/icons/alarm-clock.png"
              }" alt="Bosch color pattern" id="${response[i].code}-icon" />
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item" id="${response[i].code}-name">Nome: ${
              response[i].name
            }
              </li>
              <li class="list-group-item" id="${
                response[i].code
              }-done">Status: ${response[i].done ? "Concluído" : "Executando"}
              </li>
              <li class="list-group-item" id="${
                response[i].code
              }-time">Tempo: ${response[i].time}
              </li>
              <li class="list-group-item">
                <button type="button" class="btn btn-primary btn-resp" data-bs-toggle="modal"
                  data-bs-target="#${response[i].code}-modal">
                  Respostas
                </button>

                <div class="modal fade" id="${
                  response[i].code
                }-modal" tabindex="-1" aria-labelledby="exampleModalLabel"
                  aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-header" style="background-color: rgb(247, 247, 247)">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">
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
                                    response[i].w1
                                  }" id="${
              response[i].code
            }-w1" type="number"  class="form-control"
                                  aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                                </div>

                                <div class="input-group mb-3">
                                  <span class="input-group-text" id="inputGroup-sizing-default"><img
                                      src="../../assets/formas/quadrado.png" class="mini-icon" /></span>
                                  <input disabled value="${
                                    response[i].w2
                                  }" id="${
              response[i].code
            }-w2" type="number" class="form-control"
                                  aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                                </div>

                                <div class="input-group mb-3">
                                  <span class="input-group-text" id="inputGroup-sizing-default"><img
                                      src="../../assets/formas/ellipse.png" class="mini-icon" /></span>
                                  <input disabled value="${
                                    response[i].w3
                                  }" id="${
              response[i].code
            }-w3" type="number" class="form-control"
                                  aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                                </div>

                                <div class="input-group mb-3">
                                  <span class="input-group-text" id="inputGroup-sizing-default"><img
                                      src="../../assets/formas/star.png" class="mini-icon" /></span>
                                  <input disabled value="${
                                    response[i].w4
                                  }" id="${
              response[i].code
            }-w4" type="number" class="form-control"
                                  aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                                </div>

                                <div class="input-group mb-3">
                                  <span class="input-group-text" id="inputGroup-sizing-default"><img
                                      src="../../assets/formas/pentagono.png" class="mini-icon" /></span>
                                  <input disabled value="${
                                    response[i].w5
                                  }" id="${
              response[i].code
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
  const elapsedTime = Date.now() - startTime;

  const remainingTime = Math.max(0, 3600000 - elapsedTime);

  const horas = Math.floor(remainingTime / 3600000);
  const minutos = Math.floor((remainingTime % 3600000) / 60000);
  const segundos = Math.floor((remainingTime % 60000) / 1000);

  const tempoFormatado = `${horas.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;

  $("#tempoRestante").text(tempoFormatado);
}
