var btn_open_modal = document.getElementById("amarelo");
var btnconfirm = document.getElementById("iniciar");
const nameInput = $('#form-participant input[type="text"]')
const dateInput = $('#form-participant input[type="date"]')
var code = null

function waitOnQueue() {
  $.get(`http://${url}:3000/started`, function (data) {
    console.log(data);
    if (data) window.location.replace(`http://${url}:3000/game/${code}`);
  });
}

nameInput.blur(function(){
  if(!$(this).val() || $(this).val().trim().length < 1){
      $(this).addClass("error");
      error = true
  } else{
      $(this).removeClass("error");
  }
});

dateInput.blur(function(){
  if(!$(this).val()){
      $(this).addClass("error");
      error = true
  } else{
      $(this).removeClass("error");
  }
});

function validation() {
  let error = false
  if (!nameInput.val() || nameInput.val().trim().length < 1) {
    nameInput.addClass("error")
    error = true
  }
  else {
    nameInput.removeClass("error")
  }
  if (!dateInput.val())
  {
    dateInput.addClass("error")
    error = true
  }

  if (error) return;

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
