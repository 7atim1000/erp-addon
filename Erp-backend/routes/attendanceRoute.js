const express = require('express');
const { isVerifiedUser } = require('../middlewares/tokenVerification');
const { addAttendance, getAttendance } = require('../controllers/attendanceController');


const router = express.Router();

router.route('/').post(addAttendance);
router.route('/fetch').post(getAttendance);
//isVerifiedUser,



module.exports = router ;

