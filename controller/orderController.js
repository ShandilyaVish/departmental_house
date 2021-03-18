const Order = require('../models/Order');
const User = require('../models/User');
const Cart = require('../models/Cart');
const {get_user} = require('../middleware/getUserIdMiddleware');
const numberOfOrdersMaxByDate = 20;

const order_get = async (req,res) => {
    res.locals.cart = await get_cart(req,res);
    res.render('orders.ejs')
}
const order_post = async (req,res) => {
    const cart = await get_cart(req,res);
    const date = req.body['date'];
    const delivery = req.body['delivery'];
    let totalPriceToBePaid = 0;
    const items = new Map();
    cart.forEach(item => {
        totalPriceToBePaid += item.totalPrice;
        items.set(item.productName,
            {productPrice : item.productPrice,productQuantity : item.productQuantity});
    });

    const numberOfOrdersByDate = (await Order.find({date : date,isPaid : true})).length;
    if (numberOfOrdersByDate > numberOfOrdersMaxByDate) {
        res.json({message : 'Pick another slot',location :'/orders'})
    }
    else {
        var userId = get_user(req,res);
        Order.create({
            user : userId,
            cart : cart,
            total : totalPriceToBePaid,
            items: items,
            date : date,
            delivery : delivery,
            isPaid : false
        }).then(result => {
            
            res.json({message : 'Payment ahead!',location : '/payment'})
        }).catch(err => console.log(err.message));
    }

}

const get_cart = async (req,res) =>{
    var userId = get_user(req,res);
    const cart = await Cart.find({user : userId});
    return cart;
}

module.exports = {
    order_get,
    order_post
}