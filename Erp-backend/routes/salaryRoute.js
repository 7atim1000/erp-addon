const express = require('express');
const  { isVerifiedUser }  = require("../middlewares/tokenVerification");
const { addSalary , getSalaries, updateDeduction, getPublicSalaries } = require('../controllers/salaryController');

const router = express.Router();

router.route('/').post(isVerifiedUser, addSalary)
router.route('/fetch').post(isVerifiedUser, getSalaries);
router.route('/').get(isVerifiedUser, getPublicSalaries)

router.route('/:empNo').put(isVerifiedUser, updateDeduction)

module.exports = router;

