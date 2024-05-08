const finishAtv = "FINALIZAR";
const code = window.location.href.split('/').slice(-1)[0]

const nameInput = $('#form-res input[type="number"]')
const tempoRestante = $("#tempoRestante")
const tentativas = $("#tentativas")
const timer = $("#timer")
const tries = $("#tries")

// TODO finish tries on screen

var startTime = null
var triesCount = null

nameInput.on( "focusout", function() {
  updateWeights()
})

function end() {
  $.get(`http://${url}:3000/status/${code}`, function (data) {
    startTime = data.startTime
    if(startTime)
      timer.removeClass("d-none")
    else
      timer.addClass("d-none")

    triesCount = data.tries
    if(!!triesCount)
      tries.removeClass("d-none")
    else
      tries.addClass("d-none")
    tentativas.text(triesCount)

    if (data.finished) window.location.replace(`http://${url}:3000/finished`);
  });
}

setInterval(end, 5000);

function finish() {
  var inputFinish = $("#validation").val();
  console.log(inputFinish)
  if (inputFinish == finishAtv) {
    $.ajax({
      url: `http://${url}:3000/final-answer/${code}`,
      type: "PATCH",
      data: $("#form-res").serialize(),
      success: function (response) {
        window.location.replace(`http://${url}:3000/finished`);
      },
      error: function (xhr, status, error) {
        alert("ocorreu um erro")
      },
    });
  }
  return false;
}


function updateWeights() {
  $.ajax({
    url: `http://${url}:3000/update-weights/${code}`,
    type: "PATCH",
    data: $("#form-res").serialize(),
    success: function (response) {
    },
    error: function (xhr, status, error) {
      alert("ocorreu um erro")
    },
  });
}

function atualizarTempoRestanteFrontend() {
  if (!startTime)
    return;
  const elapsedTime = (Date.now() - startTime)// - pauseTime;

  const remainingTime = Math.max(0, 3600000 - elapsedTime);

  const horas = Math.floor(remainingTime / 3600000);
  const minutos = Math.floor((remainingTime % 3600000) / 60000);
  const segundos = Math.floor((remainingTime % 60000) / 1000);

  const tempoFormatado = `${horas.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;

  tempoRestante.text(tempoFormatado);
}

setInterval(atualizarTempoRestanteFrontend, 1000);