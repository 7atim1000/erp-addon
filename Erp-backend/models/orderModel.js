const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema ({
    
    customerDetails : {
        name: { type: String },
        customer: { type: String },
        phone: { type: String },
        guests: { type: Number },
    },

    orderStatus: { type: String },
    orderDate: { type: Date, default: Date.now()},
    
    bills: {
        total: { type: Number },
        tax: { type: Number },
        totalWithTax: { type: Number },
    },

    items : [], services :[],
    service : { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    customer : { type: mongoose.Schema.Types.ObjectId, ref: "Customers"},
    
    payment :{ type: Number},
    paymentMethod: {type: String},

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    
    /*
    paymentData: {
        razorpay_order_id: String,
        razorpay_payment_id: String
    }
    */

}, { timestamps: true })


module.exports = mongoose.model('Order', orderSchema);
