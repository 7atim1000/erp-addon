const express = require('express') ;
const { isVerifiedUser } = require('../middlewares/tokenVerification');
const { addProduct, getProducts, removeProduct } = require('../controllers/productsController');

const router  = express.Router();


router.route('/').post(isVerifiedUser, addProduct);
router.route('/').get(isVerifiedUser, getProducts);
router.route('/remove').post(isVerifiedUser, removeProduct);


module.exports = router ;