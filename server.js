const express = require('express');
const bodyParser = require('body-parser');
const ExcelJS = require('exceljs');

const app = express();

app.use(bodyParser.json());

const alunos = [];


app.post('/resposta', (req, res) => {
    const { nome, concluiu, tempo, p1, p2, p3, p4, p5 } = req.body;

    let pontuacoes = {
        p1: p1 || 0,
        p2: p2 || 0,
        p3: p3 || 0,
        p4: p4 || 0,
        p5: p5 || 0
    };

    alunos.push({ nome, concluiu, tempo, ...pontuacoes });

    res.send('Dados recebidos com sucesso!');
});

app.post('/pesos', (req, res) => {
    let { plate1, plate2 } = req.body;

    plate1 = plate1 ?? 0;
    plate2 = plate2 ?? 0;

    plate1 = parseFloat(plate1);
    plate2 = parseFloat(plate2);

    if (plate1 > plate2)
        res.send('-1');

    else if (plate1 === plate2)
        res.send('0');

    else
        res.send('1');
});

app.get('/resultado', (req, res) => {
    res.json(alunos);
});


let startTime; 
let timer; 

app.post('/start-timer', (req, res) => {
    if (timer) {
        return res.status(400).send('O cronômetro já está em execução.');
    }

    startTime = Date.now();

    timer = setTimeout(() => {
        console.log('Tempo encerrado.');
        saveExcel()
    }, 3600000); 

    res.send('Cronômetro de 1 hora iniciado.');
});

app.post('/finalizar', (req, res) => {
    saveExcel();

    res.send('Atividade finalizada.');
});

app.get('/check-timer', (req, res) => {
    if (!timer) {
        return res.send('O cronômetro não está em execução.');
    }

    const elapsedTime = Date.now() - startTime;

    const remainingTime = Math.max(0, 3600000 - elapsedTime);

    const hours = Math.floor(remainingTime / 3600000);
    const minutes = Math.floor((remainingTime % 3600000) / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);

    if (hours > 0)
        res.send(`Tempo restante no cronômetro - ${hours}:${minutes}:${seconds}`);

    res.send(`Tempo restante no cronômetro - ${minutes}:${seconds}`);
});

app.use((req, res, next) => {
    console.log('Dados recebidos:', req.body);
    next();
});

async function saveExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Alunos');

    worksheet.addRow(['Nome', 'Concluiu', 'Tempo', 'P1', 'P2', 'P3', 'P4', 'P5']);

    alunos.forEach(aluno => {
        worksheet.addRow([aluno.nome, aluno.concluiu, aluno.tempo, aluno.p1, aluno.p2, aluno.p3, aluno.p4, aluno.p5]);
    });

    await workbook.xlsx.writeFile('alunos.xlsx');
    console.log('Alunos salvos em alunos.xlsx');
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
