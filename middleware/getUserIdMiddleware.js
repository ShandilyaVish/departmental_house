const jwt = require('jsonwebtoken');
const Cart = require('../models/Cart');

const get_user = (req,res) => {
    const token = req.cookies.jwt;
    var userId;
    if(token) {
        jwt.verify(token,'net ninja secret',  (err,decodedToken) => {
            if(err) {
                console.log(err.message);
                //next();
            } else {
                userId = decodedToken.id;
                //next();
            }
        });
    } else {
        console.log(err.message);
        //next();
    } 
    return userId;
}


module.exports = {get_user};