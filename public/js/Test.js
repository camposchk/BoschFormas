var btn_open_modal = document.getElementById("amarelo");
var btnconfirm = document.getElementById("iniciar");

function waitOnQueue() {
    $.get("/started", function (data) {
        console.log(data)
        if (data)
            window.location.replace(`//${url}:3000/game`);
    })
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
        dataType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: $("#form-participant").serialize(),
        success: function(response) {
            tilt(Number(response));
            console.log(response)
        },
        error: function(xhr, status, error) {
            console.log("Error:", error);
        }
    });
    
    setInterval(waitOnQueue, 5000);
  }
  return false;
}
