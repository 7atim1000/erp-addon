const mongoose = require('mongoose')

const invoiceSchema = new mongoose.Schema({

    type :{ type: String },
    shift : { type: String, enum :['Morning', 'Evening'], required :true},
    
    invoiceNumber :{ type: String },
    invoiceType :{ type: String, required :[true, 'Invoice type field is required']},
    invoiceStatus :{ type: String, required:[true, 'Invoice status field is required']},

    // customerDetails : {
    //     customer: { type: String },
    // },
    customer :{ type: mongoose.Schema.Types.ObjectId , ref:'Customers' },
    customerName :{ type: String },
    supplier :{ type: mongoose.Schema.Types.ObjectId, ref:'Supplier'},
    supplierName :{ type: String },

    
    items : [],

    saleBills :{
        total :{ type: Number },
        tax :{ type: Number },
        totalWithTax :{ type: Number },
        payed :{ type: Number },
        balance : { type: Number },

    }, 
    buyBills :{
        total :{ type : Number }, 
        tax :{ type: Number },
        totalWithTax : { type: Number },
        payed :{ type: Number },
        balance : { type: Number },


    },
    bills :{
        total :{ type: Number},
        tax :{ type: Number },
        totalWithTax :{ type: Number },
        payed :{ type: Number },
        balance : { type: Number },

    },

    paymentMethod: {type: String},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    invoiceDate: { type: Date, default: Date.now()},
    date: { type: Date, default: Date.now() },    
    // date : { type: String, 
    //  default: () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)    
    //  // default : new Date().toISOString().slice(0, 10)
    //     }

} ,{ timestamps :true})


module.exports = mongoose.model('Invoice', invoiceSchema)





// const getInvoices = async (req, res, next) => {

//     try {

//         const invoices = await Invoice.aggregate([
//             { $unwind: "$items" },
//             { $replaceRoot: { newRoot: "$items" } }
//         ]);

//         res.status(200).json({
//             message: 'All invoices fetched successfully',
//             success: true,
//             data: invoices,
//             invoices
//         })

//     } catch (error) {
//         next(error)
//     }
// }