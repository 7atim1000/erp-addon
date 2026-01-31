const express = require('express')

const  { isVerifiedUser }  = require("../middlewares/tokenVerification");

const { addInvoice, getInvoices, 
        updateInvoice, getInvoiceCart,
        getInvoiceCartAll , getInvoiceDetails, 
        getCustomerItems,
        getCustomerDetails,
        getSupplierDetails,
        getInvoiceById,
        

} = require('../controllers/invoiceController')


const router = express.Router();

router.route('/').post(isVerifiedUser, addInvoice);
//router.route('/').get(getInvoices);
router.route('/fetch').post(isVerifiedUser, getInvoices);
router.get('/:id', getInvoiceById);

router.route('/carts').get(isVerifiedUser, getInvoiceCartAll);
// router.route('/cartOne').get(getInvoiceItems);
router.route('/cartOne').post(isVerifiedUser, getInvoiceCart);
router.route('/cartDetails').post(isVerifiedUser, getInvoiceDetails);

// customers Invoices
router.route('/customerItems').post(isVerifiedUser, getCustomerItems);
router.route('/customerDetails').post(isVerifiedUser, getCustomerDetails);

// suppliers Invoices
router.route('/supplierDetails').post(isVerifiedUser,getSupplierDetails);

// update Invoices
router.route('/:id').put(isVerifiedUser, updateInvoice);





module.exports = router ;