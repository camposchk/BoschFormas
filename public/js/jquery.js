$(" #Entrar ").on("click", (e) => {
  var senha = $("#senha").val();

  $.ajax({
    type: "POST",
    url: "/init",
    data: {
      senha: senha,
    },
    success: (data) => {
      $(" #login ").trigger("submit");
    },
    error: (data) => {
      $(" #error ").removeClass("hide");
    },
  });
});

$(" .alerta button ").on("click", (e) => {
  $(" #error ").addClass("hide");
});
