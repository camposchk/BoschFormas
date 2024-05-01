const myModal = document.getElementById("myModal");
const myInput = document.getElementById("myInput");

myModal.addEventListener("shown.bs.modal", () => {
  myInput.focus();
});

function atualizarTempoRestante() {
  fetch("/check-timer")
    .then(response => response.text())
    .then(tempoRestante => {
      document.getElementById("tempoRestante").innerText = tempoRestante;
    });
}

function startTimer() {
  fetch("/start-timer")
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao iniciar o temporizador');
      }
      console.log("Temporizador iniciado com sucesso!");
      setInterval(atualizarTempoRestante, 1000);
    })
    .catch(error => {
      console.error('Erro ao iniciar o temporizador:', error.message);
    });
}

  function atualizarTempoRestanteFrontend() {
    
    let startTime = Date.now();

    const elapsedTime = Date.now() - startTime;

    const remainingTime = Math.max(0, 3600000 - elapsedTime);

    const horas = Math.floor(remainingTime / 3600000);
    const minutos = Math.floor((remainingTime % 3600000) / 60000);
    const segundos = Math.floor((remainingTime % 60000) / 1000);

    const tempoFormatado = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;


    document.getElementById("tempoRestante").innerText = tempoFormatado;
  }
