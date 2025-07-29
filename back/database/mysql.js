const mysql = require("mysql2/promise")
const dotenv = require("dotenv")

let pool
dotenv.config()

try{
    pool = mysql.createPool({
        host:process.env.DB_HOST,
        user:process.env.DB_USER,
        database:process.env.DB_NAME,
        port:process.env.DB_PORT,
        password:process.env.DB_PASSWORD
    })
    console.log("MySQL Connection✅")
}catch(error){
    console.error("MySQL Connection❌",error)
}
module.exports = pool