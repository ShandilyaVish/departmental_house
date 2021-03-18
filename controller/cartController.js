const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const {get_user} = require('../middleware/getUserIdMiddleware');
// const handleErrors = (err) => {

// }

const cart_get = async (req,res,next) => {
    var id = get_user(req,res);
    if (id) {
        res.locals.cart = await Cart.find({user : id});
    } else {
        res.locals.cart = null;
    }
    res.render('carts.ejs');
}

const cart_post = async (req,res) => {
    const {productName,addedQuantity} = req.body;
    const product = await Product.findOne({productName});
    console.log(req.body);
    const totalPrice = product.productPrice * addedQuantity;
    if (product.productQuantity < addedQuantity) {
        res.json('Not enough quantity is present');
    } else {
        var id = get_user(req,res);
        const user = await User.findById(id);
        const cart = await Cart.findOne({user : user._id,product : product._id});
        if(cart) {
            console.log(cart.quantity+addedQuantity);
            Cart.findOneAndUpdate({user : user._id,product : product._id},
                {quantity : (cart.quantity+addedQuantity),totalPrice : (cart.totalPrice+totalPrice)})
                .then(result => {
                    res.json('Successfully added');
                }).catch(err => console.log(err.message));
        }
        else {
            Cart.create({
                user : user._id,
                product : product._id,
                productName : productName,
                totalPrice: totalPrice,
                quantity : addedQuantity
            }).then(result => {
                res.json('Successfully added');
            }).catch(err => console.log(err.message))
        }
        //res.locals.cart = await Cart.find({});
    }
}

const cart_delete = async (req,res) => {
    const {productName} = req.body;
    var id = get_user(req,res);
    Cart.findOneAndRemove({user : id,productName});
    //res.locals.cart = await Cart.find({});
}



module.exports = {
    cart_get,
    cart_post,
    cart_delete
}