const { checkout, placeOrder, confirmPurchase, viewPurchaseHistory, viewOrderItems, viewVendorSales } = require("../controller/checkout/checkController");
const express = require("express");

const checkRoutes = express.Router();

checkRoutes.post('/checkout', checkout); 
checkRoutes.post('/place-order', placeOrder); 
checkRoutes.post('/confirm-purchase', confirmPurchase); 
checkRoutes.get('/history', viewPurchaseHistory); 
checkRoutes.get('/order/:order_id', viewOrderItems); 
checkRoutes.get('/vendor/sales', viewVendorSales); 

module.exports = checkRoutes;   