const mongoose = require('mongoose')

const storeInvoiceSchema = new mongoose.Schema({

    shift : { type: String, enum :['Morning', 'Evening'], required :true},
    
    storeinvoiceNumber :{ type: String },
    storeinvoiceType :{ type: String, required :[true, 'Invoice type field is required']},
    storeinvoiceStatus :{ type: String, required:[true, 'Invoice status field is required']},

    customer :{ type: mongoose.Schema.Types.ObjectId , ref:'Customers' },
    customerName :{ type: String },
    customerDetails: {
        name: { type: String },
        phone: { type: String },
    },


    supplier :{ type: mongoose.Schema.Types.ObjectId, ref:'Supplier'},
    supplierName :{ type: String },
    supplierDetails : {
        name: { type: String },
        phone: {type: String},
    },

    
    items : [],

    exchangeBills :{
        total :{ type: Number },
        tax :{ type: Number },
        totalWithTax :{ type: Number },
   
    }, 
    receiptBills :{
        total :{ type : Number }, 
        tax :{ type: Number },
        totalWithTax : { type: Number },

    },
    bills :{
        total :{ type: Number},
        tax :{ type: Number },
        totalWithTax :{ type: Number },
    },


    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    invoiceDate: { type: Date, default: Date.now()},
    date: { type: Date, default: Date.now()},    
   

} ,{ timestamps :true})


module.exports = mongoose.model('StoreInvoice', storeInvoiceSchema)



