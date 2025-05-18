import express from "express";

const port = 3050;
const host = "0.0.0.0";

const app = express();

app.use(express.urlencoded({extended: true}))

app.get("/",(req,resp)=> 
    {
        resp.send(` <html>
            <head>
                <title> Pagina Inicial </title>
            </head>
            <body>

            </body>
                    </html>`)
    })

app.listen(port,host, () => {
  console.log('App de exemplo esta rodando na porta 3050' )
})