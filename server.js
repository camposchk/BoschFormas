const express = require("express");
const bodyParser = require("body-parser");
const ExcelJS = require("exceljs");
const cors = require("cors");
const { createProxyMiddleware } = require('http-proxy-middleware');
require("dotenv").config();

const data = { url: process.env.CURR_IP };

const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use(express.static("public"));

var started = false;
const competitors = [];
const weights = [100, 200, 400, 800, 1600];

app.post("/ready", async (req, res) => {
  const { name, dataNasc, w1, w2, w3, w4, w5 } = req.body;
  if(!dataNasc)
    return res.status(400).send("Sem data de nascimento")

  let accessed = false;
  let done = false;
  let time = "";

  let score = {
    w1: w1 || 0,
    w2: w2 || 0,
    w3: w3 || 0,
    w4: w4 || 0,
    w5: w5 || 0,
  }; 

  let tentativas = 0;
  let pieces = 0;

  let code = await generate();

  competitors.push({ name, dataNasc, done, time, ...score, tentativas, pieces, code, accessed });

  res.send({ message: "Dados recebidos com sucesso!", code: code });
});

app.patch("/update-weights/:code", (req, res) => {
  const { code } = req.params;
  const { w1, w2, w3, w4, w5 } = req.body;

  const competitorIndex = competitors.findIndex(
    (competitor) => competitor.code === code
  );

  if (competitorIndex === -1) {
    return res.status(404).send("Competidor não encontrado.");
  }

  competitors[competitorIndex].w1 = w1 || competitors[competitorIndex].w1;
  competitors[competitorIndex].w2 = w2 || competitors[competitorIndex].w2;
  competitors[competitorIndex].w3 = w3 || competitors[competitorIndex].w3;
  competitors[competitorIndex].w4 = w4 || competitors[competitorIndex].w4;
  competitors[competitorIndex].w5 = w5 || competitors[competitorIndex].w5;

  res.send(competitors[competitorIndex]);
});

app.patch("/final-answer/:code", (req, res) => {
  const { code } = req.params;
  const { w1, w2, w3, w4, w5 } = req.body;

  const competitorIndex = competitors.findIndex(
    (competitor) => competitor.code === code
  );

  if (competitorIndex === -1) {
    return res.status(404).send("Competidor não encontrado.");
  }

  competitors[competitorIndex].w1 = w1 || competitors[competitorIndex].w1;
  competitors[competitorIndex].w2 = w2 || competitors[competitorIndex].w2;
  competitors[competitorIndex].w3 = w3 || competitors[competitorIndex].w3;
  competitors[competitorIndex].w4 = w4 || competitors[competitorIndex].w4;
  competitors[competitorIndex].w5 = w5 || competitors[competitorIndex].w5;

  competitors[competitorIndex].done = true;

  const elapsedTime = Date.now() - startTime;

  const minutes = Math.floor(elapsedTime / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);

  competitors[competitorIndex].time = `${minutes}:${seconds}`;

  res.send(competitors[competitorIndex]);
});

app.post("/scales", (req, res) => {
  let { quantities } = req.body;
  if (!quantities) return res.status(400).send({ message: "vazio" });
  
  let results = []
  for (let i = 0; i < quantities.length; i++) {
    const bal = quantities[i];
    let plate1 = 0;
    let plate2 = 0;
    
    for (let j = 0; j < 5; j++) {
      plate1 += bal[j] * weights[j];
      plate2 += bal[j + 5] * weights[j];
    }
    if (plate1 > plate2) results.push(-1);
    else if (plate1 === plate2) results.push(0);
    else results.push(1);
  }

  res.send({ results });
});


app.get("/competitors", (req, res) => {
  res.json(competitors);
});

let startTime;
let timer;
let startPause;
let pauseTime = 0;

var finished = false;

app.post("/start-timer", (req, res) => {
  if (timer) {
    return res.send({startTime: startTime, message: "O cronômetro já está em execução."});
  }

  startTime = Date.now();

  timer = setTimeout(() => {
    console.log("Tempo encerrado.");
    finished = true;
    saveExcel();
  }, 3600000);

  started = true;
  res.send({startTime: startTime, message: "Cronômetro de 1 hora iniciado."});
});

app.get("/pause-timer", (req, res) => {
  if (startPause) {
    pauseTime += Date.now() - startPause
    startPause = null
    return res.send({pauseTime: pauseTime, paused: false});
  }

  startPause = Date.now();

  res.send({pauseTime: pauseTime, paused: true});
});

app.get("/check-timer", (req, res) => {
  if (!timer) {
    return res.status(409).send("O cronômetro não está em execução.");
  }

  var elapsedTime = (Date.now() - startTime) - pauseTime;
  if (startPause) {
    elapsedTime -= Date.now() - startPause
  }

  const remainingTime = Math.max(0, 3600000 - elapsedTime);

  const hours = Math.floor(remainingTime / 3600000);
  const minutes = Math.floor((remainingTime % 3600000) / 60000);
  const seconds = Math.floor((remainingTime % 60000) / 1000);

  if (hours > 0)
    return res.send({startTime: startTime, leftTime: `00:${minutes}:${seconds}`, paused: startPause ? true : false});
  return res.send({startTime: startTime, leftTime: `${hours}:${minutes}:${seconds}`, paused: startPause ? true : false});
});

app.post("/finish", (req, res) => {
  finished = true;
  saveExcel();

  res.send("Atividade finalizada.");
});

app.get("/game/:code", (req, res) => {
  const code = req.params.code;
  var result = competitors.find((cp) => cp.code === code);
  // if (!result) return res.send("nao existe");
  // if (result.accessed) return res.send("ja era");
  result.accessed = true

  res.render("Game", { data: data });
});
app.get("/test", (req, res) => {
  res.render("Test", { data: data });
});
app.get("/dashboard", (req, res) => {
  res.render("Dashboard", { data: competitors, url: data.url });
});
app.get("/finished", (req, res) => {
  res.render("Finished");
});
app.get("/home", (req, res) => {
  res.render("Home");
});
app.get("/started", (req, res) => {
  res.send(started);
});
app.get("/done", (req, res) => {
  res.send(finished);
});

app.use((req, res, next) => {
  console.log("Dados recebidos:", req.body);
  next();
});

async function saveExcel() {
  const today = new Date();
  const dateFormatted = today.toISOString().slice(0, 10).replace(/-/g, '');

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Alunos");

  worksheet.addRow([
    "Nome",
    "Data de Nascimento",
    "Concluiu",
    "Tempo",
    "Peso 1",
    "Peso 2",
    "Peso 3",
    "Peso 4",
    "Peso 5",
    "Tentativas",
    "N Peças"
  ]);

  competitors.forEach((competitor) => {
    worksheet.addRow([
      competitor.name,
      competitor.dataNasc,
      competitor.done,
      competitor.time,
      competitor.w2,
      competitor.w3,
      competitor.w1,
      competitor.w5,
      competitor.w4,
      competitor.tentativas,
      competitor.pieces
    ]);
  });

  const fileName = `processo_${dateFormatted}.xlsx`;
  await workbook.xlsx.writeFile(fileName);
  console.log(`Planilha salva em ${fileName}`);
}


async function generate() {
  let secretcode = "";
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    secretcode += characters.charAt(randomIndex);
  }

  return secretcode;
}

const PORT = process.env.PORT || 3000;

app.use('/api', createProxyMiddleware({ 
  target: `$http://disrct:etstech31415@rb-proxy-ca1.bosch.com:8080:${PORT}/`,
  changeOrigin: true
}));

app.listen(PORT, () => {
  console.log(`http://${process.env.CURR_IP}:${PORT}/game`);
});
