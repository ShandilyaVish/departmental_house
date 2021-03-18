const Product = require('../models/Product');

const handleErrors = (err) => {
    const error = {
        productName : '',
        productCode : '',
        productPrice : '',
        productQuantity : ''
    };
    //different code for same product error

    //duplicate error
    if(err.code != undefined) {
        error['productCode'] = 'Please enter unique id';
    }

    //validation error
    if (err.message.includes('Product validation failed')) {
        if (err.errors['productCode']) {
            error['productCode'] = 'Please enter numeric value'; 
        }
        if (err.errors['productName']) {
            error['productName'] = 'Please enter name'; 
        }
        if (err.errors['productQuantity']) {
            error['productQuantity'] = 'Please enter numeric value'; 
        }
        if (err.errors['productPrice']) {
            error['productPrice'] = 'Please enter numeric value'; 
        }
    }

    return error;
}

const product_get = async (req,res) => {
    res.locals.products = await Product.find({});
    res.render('products.ejs',{title : 'Products'});
}

const add_product_get = (req,res) => {
    res.render('addProducts.ejs',{title : 'Add products'});
}

const add_product_post =  async (req,res) => {
    const isProductPresent = await Product.findOne({productName : req.body['productName']});
    console.log(req.body['productName']);
    //to update quantity
    if(isProductPresent) {
        const productName = req.body['productName'];
        const toBeAddedProductQuantity = req.body['productQuantity'];
        const beforeUpdateQuantity = isProductPresent['productQuantity'];
        const overallQuantity = parseInt(toBeAddedProductQuantity) + parseInt(beforeUpdateQuantity);
        Product.findOneAndUpdate({productName : productName},
            {productQuantity : overallQuantity},  function (err,result) {
                if(err) {
                    res.status(400);
                }
                else {
                    res.status(200).json('Successfully added');
                }
            });
    }
    //if not present create one 
    else {
        const product = new Product(req.body);
        product.save().then(result => {
            res.status(200).json('Successfully added');
        }).catch(err => 
            {
                const errors = handleErrors(err);
                console.log({errors});
                res.status(400).json({errors});
            }
        );
    }
}

module.exports = {
    product_get,
    add_product_get,
    add_product_post,
}