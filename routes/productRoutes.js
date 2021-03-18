const express = require('express');
const {isAdmin} = require('../middleware/authMiddleware');
const {product_get,add_product_get,add_product_post} = require('../controller/productController');

const routes = express.Router();

routes.get('/',product_get);
routes.get('/add',isAdmin,add_product_get);
routes.post('/add',isAdmin,add_product_post);
// routes.put('/update',isAdmin,update_product);

module.exports = routes;