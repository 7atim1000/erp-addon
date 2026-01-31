const express = require('express') ;
const { isVerifiedUser } = require('../middlewares/tokenVerification');
const { addStoreUnit, getStoresUnits, removeStoreUnit } = require('../controllers/storesUnitsController');

const router = express.Router() ;



router.route('/').post(isVerifiedUser, addStoreUnit);
router.route('/').get(isVerifiedUser ,getStoresUnits);
router.route('/remove').post(isVerifiedUser, removeStoreUnit);

module.exports = router