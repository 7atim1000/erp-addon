const express = require('express')

const  { isVerifiedUser }  = require("../middlewares/tokenVerification");
const { addstoreInvoice, getStoresInvoices } = require('../controllers/storeInvoiceController');

const router = express.Router();


router.route('/').post(isVerifiedUser, addstoreInvoice);
router.route('/fetch').post(isVerifiedUser, getStoresInvoices);




module.exports = router ;