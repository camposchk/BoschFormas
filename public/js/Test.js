var btn_open_modal = document.getElementById("amarelo");
var btnconfirm = document.getElementById("iniciar");
var code = null

function waitOnQueue() {
  $.get(`http://${url}:3000/started`, function (data) {
    console.log(data);
    if (data) window.location.replace(`http://${url}:3000/game/${code}`);
  });
}

function validation() {
  btn_open_modal.disabled = false;

  if (btnconfirm.click) {
    btn_open_modal.disabled = true;
    btn_open_modal.style.backgroundColor = "#c9a802";
    btn_open_modal.style.color = "white";
    btn_open_modal.value = "Aguardando outros participantes...";

    $.ajax({
      url: `http://${url}:3000/ready`,
      type: "POST",
      data: $("#form-participant").serialize(),
      success: function (response) {
        code = response.code
        setInterval(waitOnQueue, 5000);
      },
      error: function (xhr, status, error) {
        console.log("Error:", error);
      },
    });

  }
  return false;
}
