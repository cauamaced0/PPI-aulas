import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'segredo123',
  resave: false,
  saveUninitialized: true
}));

let produtos = [];

function verificarLogin(req, res, next) {
  if (req.session.usuario) {
    next();
  } else {
    res.send('Você precisa fazer login para acessar esta página. <a href="/">Voltar</a>');
  }
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

app.post('/login', (req, res) => {
  const nome = req.body.username;
  if (nome) {
    req.session.usuario = nome;
    res.cookie('ultimoAcesso', new Date().toLocaleString());
    res.redirect('/cadastro');
  } else {
    res.send('Nome inválido. <a href="/">Voltar</a>');
  }
});

app.get('/cadastro', verificarLogin, (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'cadastro.html'));
});

app.post('/cadastro', verificarLogin, (req, res) => {
  const p = {
    codigo: req.body.codigo,
    descricao: req.body.descricao,
    precoCusto: req.body.precoCusto,
    precoVenda: req.body.precoVenda,
    validade: req.body.validade,
    estoque: req.body.estoque,
    fabricante: req.body.fabricante
  };
  produtos.push(p);
  res.redirect('/cadastro');
});

app.get('/produtos', verificarLogin, (req, res) => {
  res.json({ produtos });
});


export default app;