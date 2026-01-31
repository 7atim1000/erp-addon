const createHttpError = require('http-errors');
const moment = require('moment');

const { mongoose } = require('mongoose');
const StoreInvoice = require('../models/storeInvoiceModel');

const addstoreInvoice = async (req, res, next) => {
    
    function getCurrentShift() {
        
        const hour = new Date().getHours();
        // Example: morning = 6:00-17:59, evening = 18:00-5:59
        return (hour >= 6 && hour < 18) ? 'Morning' : 'Evening';
    }


    try {

        //const invoice = new Invoice(req.body);
        const storeinvoice = new StoreInvoice({
            ...req.body,
            shift : getCurrentShift(),
        });

        await storeinvoice.save();
        res.status(201).json({ success: true, message: 'Store invoice created successfuly!', data: storeinvoice });

    } catch (error) {
        next(error)
    }
};


// const getStoresInvoices = async (req, res, next) => {
//     try {
//         const { frequency, storeinvoiceStatus, shift, itemName, itemStore } = req.body;
        
//         const query = {
//             date: {
//                 $gt: moment().subtract(Number(frequency), "d").toDate(),
//             },
//             ...(storeinvoiceStatus !== 'all' && { storeinvoiceStatus }),
//             ...(shift && shift !== 'all' && { shift }),
//         };

//         // Add item filters if provided
//         if (itemName) {
//             query['items.name'] = itemName;
//         }
//         if (itemStore) {
//             query['items.store'] = itemStore;
//         }

//         const invoices = await StoreInvoice.find(query);

//         res.status(200).json({ 
//             success: true, 
//             message: 'All stores invoices fetch successfully', 
//             invoices, 
//             data: invoices 
//         });

//     } catch (error) {
//         next(error);
//     }
// };

const getStoresInvoices = async (req, res, next ) => {
    
    try {
        
        const { frequency ,storeinvoiceType ,shift, itemStore, itemName } = req.body ;
        const invoices = await StoreInvoice.find(
            
            { 
                // type :'bills',
                // by duration
                date :{
                    $gt : moment().subtract(Number(frequency), "d").toDate(),
                },
                
                ...(storeinvoiceType !== 'all' && {storeinvoiceType}),
                ...(shift && shift !== 'all' && { shift }),

                ...(itemStore !== 'all' && { 'items.store': itemStore }),
                ...(itemName !== 'all' && { 'items.id': itemName }),
            }
        )
    
          
     
        //res.status(200).json(invoices);
        res.status(200).json({ success: true, message: 'All stores invoices fetch successfully', invoices, data: invoices})

    } catch (error) {
        next(error)
    }
};



module.exports = { addstoreInvoice, getStoresInvoices }