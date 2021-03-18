const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req,res,next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token,'net ninja secret',(err,decodedToken) => {
            if(err) {
                console.log(err.message);
                res.redirect('/login');
            } else{
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
}

const checkUser =  (req,res,next) => {
    const token = req.cookies.jwt;

    if(token) {
        jwt.verify(token,'net ninja secret',async (err,decodedToken) => {
            if(err) {
                res.locals.user = null;
                next();
            } else{
                const user = await User.findById(decodedToken.id);
                console.log(user);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
}

const isAdmin = (req,res,next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token,'net ninja secret',async (err,decodedToken) => {
            if(err) {
                console.log(err.message);
                res.redirect('/login');
            } else{
                const user  = await User.findById(decodedToken.id);
                if(user.isAdmin) {
                    next();
                }
                else {
                    console.log("Not a admin");
                    res.render('forbidden.ejs')
                }
            }
        });
    } else {
        res.redirect('/login');
    }
}


module.exports = {
    requireAuth,
    checkUser,
    isAdmin,
};