const express = require('express')
const app = express()
const port = 3000
const pool = require("./database/mysql")
const cors = require('cors')
const dotenv = require("dotenv")
const session = require('express-session')
const MySQLStore = require("express-mysql-session")(session)
//routes
const locRoutes = require("./routes/locRoutes")
const categoryRoutes = require("./routes/categoryRoutes")
const authRoutes = require("./routes/authRoutes")
const prodRoutes = require("./routes/prodRoutes")
const cartRoutes = require("./routes/cartRoutes")
const checkRoutes = require("./routes/checkRoutes")

dotenv.config()
app.use(express.json())
app.use(cors({origin:"http://localhost:5173",credentials:true}))

const sessionStorage= new MySQLStore({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

app.use(session({
    name:"connect.sid",
    secret:process.env.SESSION_KEY,
    resave:false,
    saveUninitialized:false,
    store:sessionStorage,
    cookie:{
        httpOnly:true,
        secure:false,
        sameSite:"lax",
        maxAge: 1000 * 60 * 60 * 24
    }
}))

app.set('dbConnection', pool)

app.use("/location/auth",locRoutes)
app.use("/categories/auth",categoryRoutes)
app.use("/user/auth",authRoutes)
app.use("/product/auth",prodRoutes)
app.use("/cart/auth",cartRoutes)
app.use("/check/auth",checkRoutes)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))