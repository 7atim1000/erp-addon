const mongoose = require('mongoose');

const representativeSchema = new mongoose.Schema({
    repName :{ type: String, required: true},
    contactNo :{ type: String, required: true},
    address :{ type: String, required : true},
    
    entitlement : { type : Number },
    payed : { type: Number },
    balance :{ type: Number, required: true}

}, {timestamps : true})


module.exports = mongoose.model('Representative', representativeSchema);