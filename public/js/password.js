const hidePassword = document.querySelector(".bi-eye");
const hidePassword2 = document.querySelector("#eye");
const hidePassword3 = document.querySelector("#eyetwo");
const input = document.querySelector("#senha");

hidePassword.addEventListener("click", togglePass);

function togglePass() {
  if (input.type == "password") {
    input.type = "text";
    hidePassword.classList.replace("bi-eye", "bi-eye-slash");
  } else {
    input.type = "password";
    hidePassword.classList.replace("bi-eye-slash", "bi-eye");
  }
}
