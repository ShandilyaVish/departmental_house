const express = require('express');
const {get_payment,post_payment} = require('../controller/paymentController');

const paymentRoutes = express.Router();

paymentRoutes.get('/',get_payment);
paymentRoutes.post('/',post_payment);

module.exports = {
    paymentRoutes
}