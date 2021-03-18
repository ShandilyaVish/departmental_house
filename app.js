const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cookieParser = require('cookie-parser');
const {requireAuth,checkUser,isAdmin,isNotAdmin} = require('./middleware/authMiddleware');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const {paymentRoutes} = require('./routes/paymentRoutes');
const bodyParser = require('body-parser');
const Cart = require('./models/Cart');
const stripe = require('stripe')("sk_test_51IOvdfIRayP1c5M70H7vc0lxwOZU98DPNbF9DV0058PJiFA1pS2AKGXsZI3w9qPPc2FnlilLY0JUJvAZ8hz1X2Va00ogufbDi5");
const {get_user} = require('./middleware/getUserIdMiddleware');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// middleware
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
  extended: true 
}));
app.use(cookieParser());
// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(process.env.PORT ||3000))
  .catch((err) => console.log(err));


app.get('*',checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/success', requireAuth,(req,res) => res.render('smoothies.ejs'))

// routes
app.use(authRoutes);
// app.use(addToCart);
app.use('/products',requireAuth,productRoutes);
app.use('/carts',requireAuth,cartRoutes);
app.use(async(req,res,next) => {
    var userId = get_user(req,res);
    const cart = await Cart.find({user : userId});
    let totalPriceToBePaid = 0;
    const items = new Map();
    cart.forEach(item => {
        totalPriceToBePaid += item.totalPrice;
        items.set(item.productName,
            {productPrice : item.productPrice,productQuantity : item.productQuantity});
    });
    res.locals.amount = totalPriceToBePaid;
    res.locals.cart = cart;
    next();

})
app.use('/orders',requireAuth,orderRoutes);
app.use('/payment',requireAuth,paymentRoutes);


