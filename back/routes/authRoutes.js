const express = require("express")
const {registerUser,loginUser,loggedUser,logoutUser} = require("../controller/auth/authController")

const authRoutes = express.Router()

authRoutes.post("/register",registerUser)
authRoutes.get("/logged",loggedUser)
authRoutes.post("/login",loginUser)
authRoutes.post("/logout",logoutUser)

module.exports = authRoutes