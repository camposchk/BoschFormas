var inputFinish = document.getElementById("validation");
const finishAtv = "FINALIZAR";

function finish() {
  if (validation.value == finishAtv) {
    return true;
  }

  return false;
}
