const finishAtv = "FINALIZAR";
const code = window.location.href.split('/').slice(-1)[0]
console.log(code)

const nameInput = $('#form-res input[type="number"]')

nameInput.on( "focusout", function() {
  updateWeights()
})

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
