const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productCode : {
        type: Number,
        unique : true,
        required: true
    },
    productName : {
        type: String,
        required: true
    },
    productQuantity : {
        type: Number,
        required: true
    },
    productPrice : {
        type: Number,
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;