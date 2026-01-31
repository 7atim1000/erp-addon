const mongoose = require('mongoose') ;

const storesitemsSchema = new mongoose.Schema({

    storeitemName: { type: String },
    storeCategory: { type: String, required: [true, 'Category field is required'] },
    // store :{ type : mongoose.Schema.Types.ObjectId, ref :'Stores'},
    store: { type: String, required: [true, 'Store field is required'] },

    receiptPrice: { type: Number, required: [true, 'Receipt price field is reqiored'] },
    exchangePrice: { type: Number, required: [true, 'Exchange price field is reqiored'] },
    quantity : { type :Number, required : [true, 'Quantity field is required']},
    unit: { type: String, required: [true, 'Unit field is required'] },
    expireDate :{ type : Date, rquire :[true, 'ExpireDate field is required']},
  
    image: { type: String },

    user: { type: mongoose.Schema.Types.String, ref: 'User' },

}, {timestamps :true})




module.exports = mongoose.model('StoresItems', storesitemsSchema);