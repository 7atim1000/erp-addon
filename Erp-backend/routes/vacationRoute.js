const express = require('express');

const { addVacation, getVacations, updateVacation } = require('../controllers/vacationController');
const  { isVerifiedUser }  = require("../middlewares/tokenVerification");

const router = express.Router();

router.route('/').post(isVerifiedUser, addVacation);
router.route('/fetch').post(isVerifiedUser, getVacations);

router.route('/:id').put(isVerifiedUser, updateVacation);

module.exports = router ;