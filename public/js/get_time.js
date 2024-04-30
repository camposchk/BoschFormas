var card = document.getElementById("");
var date_time = document.getElementById("date_time");
var gettime = new Date();
var format = gettime.toLocaleString();

date_time.textContent = "Conectado em: " + format;
