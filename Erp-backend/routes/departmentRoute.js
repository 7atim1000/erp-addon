const express = require('express') ;

const  { isVerifiedUser }  = require("../middlewares/tokenVerification");
const { addDepartment, getDepartments, removeDepartment } = require('../controllers/departmentController');

const router = express.Router();

router.route('/').post(isVerifiedUser, addDepartment);
router.route('/').get(isVerifiedUser, getDepartments);
router.route('/remove').post(removeDepartment);


module.exports = router ;