var btn_open_modal = document.getElementById("amarelo");
var btnconfirm = document.getElementById("iniciar");

function validation(){
    btn_open_modal.disabled = false;

    if(btnconfirm.click){
       btn_open_modal.disabled = true;
       btn_open_modal.style.backgroundColor = "#c9a802"
       btn_open_modal.style.color = "white"
       btn_open_modal.value = "Aguardando outros participantes..."
    }
    return false;
}
