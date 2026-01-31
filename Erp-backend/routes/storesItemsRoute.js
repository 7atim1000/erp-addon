const express = require('express');
const { isVerifiedUser } = require('../middlewares/tokenVerification');
const {addStoreItem, getStoresItems, removeStoresItems, getStoresItemsInvocie, updatereceiptQuantities,  updateexchangeQuantities} = require('../controllers/storesItemsController');

const router = express.Router();
router.route('/').post(isVerifiedUser, addStoreItem);

router.route('/fetch').post(isVerifiedUser, getStoresItems);
router.get('/', isVerifiedUser, getStoresItemsInvocie);
router.route('/remove').post(isVerifiedUser, removeStoresItems);

router.route('/update-receiptquantities').post(isVerifiedUser, updatereceiptQuantities);
router.route('/update-exchangequantities').post(isVerifiedUser,updateexchangeQuantities);

module.exports = router ;
