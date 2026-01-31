const mongoose = require('mongoose');

const storescategoriesSchema = new mongoose.Schema({

    storeCategoryName : { type :String, required :[true, 'Category name is required']},
    storeCategoryNo : { type :String, required : [true, 'Category number is required']},

    user : { type : mongoose.Schema.Types.ObjectId, ref :'User'},

}, { timestamps :   true});


module.exports = mongoose.model('Storescategories', storescategoriesSchema);