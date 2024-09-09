import "dotenv/config";
import express from "express";
import cors from "cors";

//Importyar conexão com o banco
import conn from "./config/conn.js";

//Importar Models
import Postagem from "./models/postagemModel.js"
import Usuario from "./models/usuarioModel.js"

//Importar rotas 
import postagemRouter from "./router/postagemRouter.js"
import usuarioRouter from "./router/usuarioRouter.js"

const PORT = process.env.PORT || 3333;

const app = express();

//3 middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Conexão com o banco
conn
    .sync()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor on http://localhost:${PORT}`);
    });
    })
    .catch((error) => console.error(error));

//Utilizar rotas 

app.use("/postagens", postagemRouter)
app.use("/usuarios", usuarioRouter)
app.use((request, response)=>{
    response.status(404).json({ message: "Rota não encontrada" });
})