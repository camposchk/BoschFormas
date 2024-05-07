const express = require("express");
const bodyParser = require("body-parser");
const ExcelJS = require("exceljs");
const cors = require("cors");
const { createProxyMiddleware } = require('http-proxy-middleware');
const { shuffle } = require('./utils');
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
const competitors = {};
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

  let realWeights = [0, 1, 3, 4]
  shuffle(realWeights)

  let realScore = [
    2,
    realWeights[0],
    realWeights[1],
    realWeights[2],
    realWeights[3]
  ];

  let tentativas = 0;
  let pieces = 0;

  let code = await generate();

  competitors[code] = { name, dataNasc, done, time, realScore, ...score, tentativas, pieces, code, accessed };
  console.log(competitors[code])

  res.send({ message: "Dados recebidos com sucesso!", code: code });
});

app.patch("/update-weights/:code", (req, res) => {
  const { code } = req.params;
  const { w1, w2, w3, w4, w5 } = req.body;

  if (!competitors[code]) {
    return res.status(404).send("Competidor não encontrado.");
  }

  competitors[code].w1 = w1 || competitors[code].w1;
  competitors[code].w2 = w2 || competitors[code].w2;
  competitors[code].w3 = w3 || competitors[code].w3;
  competitors[code].w4 = w4 || competitors[code].w4;
  competitors[code].w5 = w5 || competitors[code].w5;

  res.send("OK");
});

app.patch("/final-answer/:code", (req, res) => {
  const { code } = req.params;
  const { w1, w2, w3, w4, w5 } = req.body;

  if (!competitors[code]) {
    return res.status(404).send("Competidor não encontrado.");
  }

  competitors[code].w1 = w1 || competitors[code].w1;
  competitors[code].w2 = w2 || competitors[code].w2;
  competitors[code].w3 = w3 || competitors[code].w3;
  competitors[code].w4 = w4 || competitors[code].w4;
  competitors[code].w5 = w5 || competitors[code].w5;

  competitors[code].done = true;

  const elapsedTime = Date.now() - startTime;

  const minutes = Math.floor(elapsedTime / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);

  competitors[code].time = `${minutes}:${seconds}`;

  res.send("OK");
});

app.post("/testscales", (req, res) => {
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

app.post("/scales/:code", (req, res) => {
  const { code } = req.params;
  let { quantities } = req.body;

  if (!competitors[code]) {
    return res.status(404).send("Competidor não encontrado.");
  }

  if (!quantities) return res.status(400).send({ message: "vazio" });

  competitors[code].tentativas += 1;
  competitors[code].pieces = 0;

  let results = []
  for (let i = 0; i < quantities.length; i++) {
    const bal = quantities[i];
    let plate1 = 0;
    let plate2 = 0;

    for (let j = 0; j < 5; j++) {
      plate1 += bal[j] * weights[competitors[code].realScore[j]];
      plate2 += bal[j+5] * weights[competitors[code].realScore[j]];
      competitors[code].pieces += bal[j] + bal[j+5];
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
  const { code } = req.params;
  if (!competitors[code])
    return res.send("nao existe");
  if (competitors[code].accessed) return res.send("ja era");
  competitors[code].accessed = true

  res.render("Game", { data: data, code: code });
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

  const headerRow = worksheet.addRow([
    "Nome",
    "Data de Nascimento",
    "Concluiu",
    "Tempo",
    "Tentativas",
    "N Peças",
    "Peso 1",
    "Peso 2",
    "Peso 3",
    "Peso 4",
    "Peso 5",
    "R1",
    "R2",
    "R3",
    "R4",
    "R5"
  ]);

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFA0A0A0' } // Cinza
    };
    cell.font = {
      color: { argb: 'FFFFFFFF' } // Branco
    };
  });

  for (const key in competitors) {
    if (Object.hasOwnProperty.call(competitors, key)) {
      const competitor = competitors[key];
      const row = worksheet.addRow([
        competitor.name,
        competitor.dataNasc,
        competitor.done,
        competitor.time,
        competitor.tentativas,
        competitor.pieces,
        competitor.w1,
        competitor.w2,
        competitor.w3,
        competitor.w4,
        competitor.w5,
        weights[competitor.realScore[0]],
        weights[competitor.realScore[1]],
        weights[competitor.realScore[2]],
        weights[competitor.realScore[3]],
        weights[competitor.realScore[4]]
      ]);

      [competitor.w1, competitor.w2, competitor.w3, competitor.w4, competitor.w5].forEach((weight, index) => {
        const cell = row.getCell(index + 5); 

        if (weight == weights[competitor.realScore[index]]) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF00FF00' } // Verde
          };
        } else {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF0000' } // Vermelho
          };
        }
      });
    }
  }

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
  console.log(`http://${process.env.CURR_IP}:${PORT}/test`);
  console.log(`http://${process.env.CURR_IP}:${PORT}/dashboard`);
});
