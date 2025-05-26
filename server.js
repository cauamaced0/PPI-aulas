import express from 'express';
import session from'express-session';
import bodyParser from 'body-parser';
import path from'path';
import fs from 'fs';

const app = express();
const PORT = 3050;


const usuarios = { admin: '1234' };
const fornecedores = [];

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'segredo-super-seguro',
  resave: false,
  saveUninitialized: true
}));


app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario;
  next();
});

function renderPage(res, page, data = {}) {
  
const layout = fs.readFileSync('./views/layout.html', 'utf-8');
const content = fs.readFileSync(`./views/${page}.html`, 'utf-8');
const rendered = layout .replace('{{body}}', content).replace('{{data}}', JSON.stringify(data));
  res.send(rendered);
}


app.get('/', (req, res) => renderPage(res, 'home'));

app.get('/fornecedor', (req, res) => renderPage(res, 'fornecedor', { dados: {}, erros: {}, fornecedores }));

app.post('/fornecedor', (req, res) => {
  const { usuario, senha } = req.body;
  if (usuarios[usuario] && usuarios[usuario] === senha) {
    req.session.usuario = usuario;
    req.session.mensagem = 'Login realizado com sucesso!';
    res.redirect('/');
  } else {
    req.session.mensagem = 'Usuário ou senha inválidos.';
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.send(`<script>alert("Logout efetuado com sucesso!"); window.location.href="/";</script>`);
  });
});

app.get('/fornecedor', (req, res) => {
  const data = { erros: {}, fornecedores, mensagem: req.session.mensagem || null };
  req.session.mensagem = null;
  renderPage(res, 'fornecedor', data);
});

app.post('/fornecedor', (req, res) => {
  const campos = ['cnpj', 'razao_social', 'nome_fantasia', 'endereco', 'cidade', 'uf', 'cep', 'email', 'telefone'];
  const erros = {};
  const fornecedor = {};

  campos.forEach(campo => {
    const valor = req.body[campo]?.trim();
    if (!valor) {
      erros[campo] = `O campo ${campo} é obrigatório.`;
    } else {
      fornecedor[campo] = valor;
    }
  });

  if (Object.keys(erros).length > 0) {
    renderPage(res, 'fornecedor', { erros, fornecedores, dados: req.body });
  } else {
    fornecedores.push(fornecedor);
    req.session.mensagem = 'Fornecedor cadastrado com sucesso!';
    res.redirect('/fornecedor');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});