const express = require('express');
const { isVerifiedUser } = require('../middlewares/tokenVerification');
const { addStore, getStores, removeStore } = require('../controllers/storesController');

const router = express.Router() ;


router.route('/').post(isVerifiedUser, addStore);
router.route('/').get(isVerifiedUser, getStores);
router.route('/remove').post(isVerifiedUser, removeStore);

module.exports = router

