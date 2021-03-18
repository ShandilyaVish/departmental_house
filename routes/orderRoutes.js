const express = require('express');
const{order_get,order_post} = require('../controller/orderController');

const orderRoutes = express.Router();
orderRoutes.get('/',order_get);
orderRoutes.post('/',order_post);

module.exports = orderRoutes