const express = require('express');
const { isVerifiedUser } = require('../middlewares/tokenVerification');
const upload = require('../middlewares/multer');

const { addService, getServices, removeService ,updateBuyQuantities ,updateSaleQuantities, updateService} = require('../controllers/serviceController');

const router = express.Router();
// router.route('/').post(isVerifiedUser, addService);
router.post('/', upload.single('image'), isVerifiedUser, addService);
router.put('/:id', upload.single('image'), isVerifiedUser, updateService);

router.route('/fetch').post(isVerifiedUser, getServices);
router.route('/remove').post(isVerifiedUser, removeService)

router.route('/update-buyquantities').post(isVerifiedUser, updateBuyQuantities);
router.route('/update-salequantities').post(isVerifiedUser,updateSaleQuantities);


module.exports = router;


// Frontend: Prepare an array of { id, qty } and send to backend after purchase.
// Backend: Loop through items and update their quantities in the database.
// Redux/UI: Optionally update your local state if you want to reflect the new quantities immediately.