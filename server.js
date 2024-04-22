const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    if (!req.body || !req.body.message) 
        return res.status(400).send('Erro ao receber dados');
    

    const message = req.body();

    console.log(message);

    res.send(message);
});

const alunos = [];

app.post('/dashboard', (req, res) => {
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

app.get('/resultado', (req, res) => {
    res.json(alunos);
});

app.use((req, res, next) => {
    console.log('Dados recebidos:', req.body);
    next();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
