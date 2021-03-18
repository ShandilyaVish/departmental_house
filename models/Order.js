const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user : {
        type : mongoose.SchemaTypes.ObjectId,
        red : 'User',
        required : true
    },
    cart : {
        type : Object,
        required : true
    },
    total : {
        type : Number, 
        required : true
    },
    items : {
        type : Map,
        required  : true
    },
    date : {
        type : String,
        required : true
    },
    delivery : {
        type : String,
        required : true
    },
    isPaid : {
        type : Boolean,
        required : true
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;