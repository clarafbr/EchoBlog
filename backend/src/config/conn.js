import { Sequelize } from "sequelize";

const conn = new Sequelize("echoBlog", "root", "Sen@iDev77!.", {
    host:"localhost",
    dialect:"mysql",

})

//TESTANDO CONEXÃO COM O BANCO
    try {
    console.log('Connection MYSQL');
    }catch (error) {
    console.error('Error:', error);
    }

export default conn