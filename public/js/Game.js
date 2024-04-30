var inputFinish = document.getElementById("validation");
const finishAtv = "FINALIZAR";
const code = window.location.href.split('/').slice(-1)
console.log(code)

function finish() {
  if (validation.value == finishAtv) {
    return true;
  }
  return false;
}


function updateWeights() {
  $.ajax({
    url: `http://${url}:3000/update-weights/${code}`,
    type: "PATCH",
    data: $("#form-res").serialize(),
    success: function (response) {
      console.log('works', response)
    },
    error: function (xhr, status, error) {
      console.log("Error:", error);
    },
  });
}