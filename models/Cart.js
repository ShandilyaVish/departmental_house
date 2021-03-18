const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    product : {
        type: mongoose.SchemaTypes.ObjectId,
        ref : 'Product',
        required: true
    },
    user : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'User',
        required : true
    },
    productName : {
        type : String,
        required : true
    },
    totalPrice : {
        type : Number,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    }
});
const Cart = mongoose.model('Cart',cartSchema);

module.exports = Cart;