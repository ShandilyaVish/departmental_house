const express = require('express');
const {cart_get,cart_post,cart_delete} = require('../controller/cartController');

const cartRoutes = express.Router();

cartRoutes.get('/', cart_get);
cartRoutes.post('/', cart_post);
cartRoutes.delete('/',cart_delete);

module.exports = cartRoutes;