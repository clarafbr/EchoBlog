import "dotenv/config";
import express from "express";
import cors from "cors";

//Importyar conexão com o banco
import conn from "./config/conn.js";

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
    //console.log("oi mané")
    app.listen(PORT, () => {
        console.log(`Servidor on http://localhost:${PORT}`);
    });
    })
    .catch((error) => console.error(error));