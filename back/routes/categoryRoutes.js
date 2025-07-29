const {fetchCategories,fetchCategory} = require("../controller/category/categoryController")
const express = require("express")

const categoryRoutes = express.Router()

categoryRoutes.get("/categories",fetchCategories)
categoryRoutes.get("/categories/:category_id",fetchCategory)

module.exports = categoryRoutes