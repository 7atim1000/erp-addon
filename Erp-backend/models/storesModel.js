const mongoose = require('mongoose');

const storesSchema = new mongoose.Schema({

    storeNo : { type : String, required :[true, 'Store number is required']},
    storeName : { type :String, required :[true, 'Store name is required']},
    storeLocation : { type :String, required :[true, 'Store location is required']},

    user : { type : mongoose.Schema.Types.ObjectId, ref :'User'},
    
},{timestamps: true});



module.exports = mongoose.model('Stores', storesSchema);