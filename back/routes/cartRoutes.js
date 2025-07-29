const { addToCart, viewCart, removeCartItem, clearCart, incrementCartItem, decrementCartItem } = require("../controller/cart/cartController");
const express = require("express");

const cartRoutes = express.Router();

cartRoutes.post("/add", addToCart);
cartRoutes.post("/remove", removeCartItem);
cartRoutes.post("/increment", incrementCartItem);
cartRoutes.get("/", viewCart);
cartRoutes.post("/decrement", decrementCartItem);
cartRoutes.post("/clear", clearCart);

module.exports = cartRoutes; 