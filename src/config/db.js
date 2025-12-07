const mysql = require('mysql2');
const util = require('util');
require('dotenv').config();

const connection = mysql.createConnection({
   host : process.env.HOST,
    user : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE
});
let db = connection.config.database;
connection.connect((err)=>{
    if(err){
        console.log(`Error to connect with database`)
    }else{
        console.log(`Connected Database ${db}`)
    }
});

let query = util.promisify(connection.query).bind(connection);

module.exports = query;