const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: [true,'Please enter email'],
        lowercase: true,
        unique: true,
        validate: [isEmail,'Please enter valid email']
    },
    password : {
        type: String,
        required: [true,'Please enter password'],
        minlength: [6,'Min length is 6']
    },
    isAdmin : {
        type : Boolean,
        required : true
    }
});


//fire before saved to db
userSchema.pre('save', async function (next) {
    const salt = await  bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

userSchema.statics.login = async function (email,password) {
    const user = await User.findOne({email});
    if(user) {
        const auth = await bcrypt.compare(password,user.password);
        if(auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
} 

const User = mongoose.model('User',userSchema);

module.exports = User;