const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
    const error = {
        email : '',
        password : ''
    }
    console.log(err);
    //incorrect mail or pwd error
    if(err.message.includes('incorrect email')) {
        error['email'] = "incorrect email";
    }
    if(err.message.includes('incorrect password')) {
        error['password'] = "incorrect password";
    }

    //duplicate error
    if(err.code != undefined) {
        error['email'] = 'User already present';
    }
    //validation error
    if(err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            error[properties.path] = properties.message;
        });
    }
    return error;
}
// id is the mongodb user_id
const maxAge = 3*24*60*60;
const createToken = (id) => {
    return jwt.sign({id},'net ninja secret',{
        expiresIn:  maxAge  
    });
}

signup_get = (req,res) => {
    res.render("signup.ejs",{title : "Signup"});
}
signup_post = async (req,res) => {
    //res.render("signup.ejs",{title : "Signup"});
    const {email,password} = req.body;
    const isAdmin = false;
    try {
        const user = await User.create({email,password,isAdmin});
        const token = createToken(user._id);
        res.cookie('jwt',token,{
            maxAge : maxAge*1000,
            httpOnly : true 
        });
        res.status(201).json({user : user._id});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}
login_get = (req,res) => {

    res.render("login.ejs",{title : "Welcome"});
}
login_post =  async (req,res) => {
    const {email,password} = req.body;
    try {
        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.cookie('jwt',token,{
            maxAge : maxAge*1000
        });
        
        res.status(200).json({user : user._id});
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({errors});
    }

}

const logout_get = (req,res) => {
    res.cookie('jwt','',{
        maxAge : 1
    });
    res.redirect('/');
}

module.exports = {
    signup_get,
    signup_post,
    login_get,
    login_post,
    logout_get
};