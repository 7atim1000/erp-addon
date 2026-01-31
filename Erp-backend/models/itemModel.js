const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    
    name  : {type: String},
    category :{ type: String, required: [true, 'Category field is required']},
    price :{ type: Number, required: [true, 'Price field is reqiored']},
    carNo :{ type: String, required: [true, 'Please enter car number']},
    color: { type: String, required: true},
    status: { type: String, default :"Available"},
    image : { type: Array },
    
    user : { type: mongoose.Schema.Types.String , ref: 'User' },
    currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }

}, {timestamps: true})


module.exports = mongoose.model('Item', itemSchema)