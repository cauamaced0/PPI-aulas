import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 3050;
const host = "0.0.0.0";

const app = express();

app.use(express.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, 'PPI-AULAS')));


// o HTML nao aparecia a menos q fosse feito dentro do app.get
app.get("/cadastro",(req,resp)=> 
    {
        resp.send(` <html>
            <head>
                <title> Pagina Inicial </title>
            </head>
            <body>
             <h1>Cadastro de Jogo</h1>
  <form action="/cadastro" method="POST">
    <label for="titulo">Título do Jogo:</label>
    <br/>
    <input type="text" id="titulo" name="titulo" required />
    <br/>
    <br/>

    <label for="genero">Gênero:</label><br/>
    <input type="text" id="genero" name="genero" required />
    <br/>
    <br/>

    <label for="plataforma">Plataforma:</label><br/>
    <input type="text" id="plataforma" name="plataforma" required />
    <br/>
    <br/>

    <label for="ano">Ano de Lançamento:</label><br/>
    <input type="number" id="ano" name="ano" min="1970" max="2100" required /><br/><br/>

    <button type="submit">Cadastrar Jogo</button>
  </form>
            </body>
                    </html>`)
        resp.end();
    })

    app.post('/cadastro', (req, res) => {
    const { titulo, genero, plataforma, ano } = req.body;

    console.log('Jogo cadastrado:');
    console.log(`Título: ${titulo}`);
    console.log(`Gênero: ${genero}`);
    console.log(`Plataforma: ${plataforma}`);
    console.log(`Ano: ${ano}`);

    res.send(`
        <h2>Jogo cadastrado com sucesso!</h2>
        <p><strong>Título:</strong> ${titulo}</p>
        <p><strong>Gênero:</strong> ${genero}</p>
        <p><strong>Plataforma:</strong> ${plataforma}</p>
        <p><strong>Ano:</strong> ${ano}</p>
        <a href="/">Cadastrar outro</a>
    `);
});
app.listen(port,host, () => {
  console.log('App de exemplo esta rodando na porta 3050' )
})