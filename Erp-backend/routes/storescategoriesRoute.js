const express = require('express');
const { isVerifiedUser } = require('../middlewares/tokenVerification');
const { addCategory, getCategories, removeCategory } = require('../controllers/storescategoriesController');

const router = express.Router() ;


router.route('/').post(isVerifiedUser, addCategory);
router.route('/').get(isVerifiedUser, getCategories);
router.route('/remove').post(isVerifiedUser, removeCategory);

module.exports = router

