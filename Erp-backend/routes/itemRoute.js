const express = require('express');
const { isVerifiedUser } = require('../middlewares/tokenVerification');
const { addItem, getAllItems, updateItem, insertItem, removeItem } = require('../controllers/itemController');

const router = express.Router();

router.route('/').post(isVerifiedUser,addItem)
router.route('/').get(getAllItems)
router.route('/remove').post(removeItem)

router.route('/:id').put(isVerifiedUser, updateItem);

module.exports = router ;