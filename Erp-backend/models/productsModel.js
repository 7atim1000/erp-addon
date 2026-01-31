const mongoose = require('mongoose') ;

const productsSchema = new mongoose.Schema({
    
    productNo :{type: String, required :[true, 'Product number is required']},
    productName :{type :String, required :[true, 'Product name is required']},
    productStore :{type :String, required :[true, 'Product store is required'] },
    productCategory :{type: String, required :[true, 'Product category is required']},
    productUnit : {type :String, required : true},

    quantity :{type : Number, required :[true, 'Product quantity is required']},
    priceSale : {type: Number},
    priceBuy : {type: Number},
});

module.exports = mongoose.model('Products', productsSchema);