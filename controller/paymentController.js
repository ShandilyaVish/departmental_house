const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const {get_user} = require('../middleware/getUserIdMiddleware');
const {cart_delete} = require('../controller/cartController')
const stripe = require('stripe')("sk_test_51IOvdfIRayP1c5M70H7vc0lxwOZU98DPNbF9DV0058PJiFA1pS2AKGXsZI3w9qPPc2FnlilLY0JUJvAZ8hz1X2Va00ogufbDi5");
const uuid = require('uuid');


const get_payment = ('/payment',(req,res) => {
    res.render('payment.ejs')
})

const  post_payment = ('/payment',(req,res) => {
    var userId = get_user(req,res);
    console.log(req.body);
    console.log(res.locals.amount);

    return stripe.customers.create({
        email : req.body.stripeEmail,
        source : req.body.stripeToken
    }).then(customer => stripe.charges.create({
        amount : res.locals.amount*100,
        description : 'Ecommerce order',
        currency : 'inr',
        customer : customer.id
    }))
    .then(async (charge) => {
        console.log('success');
        const cart = await Cart.findOne({user : userId});
        const product = await Product.findById(cart.product);
        await Product.findByIdAndUpdate(cart.product,{productQuantity : product.productQuantity-cart.quantity});
        await Order.findOneAndUpdate({cart : cart,user : userId}, {
            isPaid : true
        });
        await Cart.deleteMany({user : userId});
        res.redirect('/success');
    }).catch(err => {
        console.log(err.message);
    })

})

module.exports = {
    get_payment,
    post_payment
}