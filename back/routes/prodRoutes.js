const {fetchAllProducts,fetchOneProduct} = require("../controller/product/customer/customerController")
const {addProduct,getVendorProducts,getOneProduct,getCategories,updateProduct,deleteProduct} = require("../controller/product/vendor/vendorController")
const express = require("express")
const checkRole = require("../middleware/isRole")

const prodRoutes = express.Router()

prodRoutes.get('/vendor',getVendorProducts)
prodRoutes.get('/vendor/:product_id',getOneProduct)
prodRoutes.post('/vendor',addProduct)
prodRoutes.put('/vendor/:product_id',updateProduct)
prodRoutes.delete('/vendor/:product_id',deleteProduct)

prodRoutes.get('/',fetchAllProducts)
prodRoutes.get('/:product_id',fetchOneProduct)

module.exports = prodRoutes