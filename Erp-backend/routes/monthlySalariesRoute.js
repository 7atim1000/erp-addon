const express = require('express');
const  { isVerifiedUser }  = require("../middlewares/tokenVerification");
const { addMonthlySalaries, getMonthlySalaries } = require('../controllers/monthlySalariesController');

const router = express.Router();

router.route('/').post(isVerifiedUser, addMonthlySalaries);
router.route('/fetch').post(isVerifiedUser, getMonthlySalaries);

module.exports = router ;