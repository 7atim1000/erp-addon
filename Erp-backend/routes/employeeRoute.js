const express = require('express');
const upload = require('../middlewares/multer')

const  { isVerifiedUser }  = require("../middlewares/tokenVerification");
const { addEmployee, getEmployees, removeEmployee, updateSalary, updateEmployee } = require('../controllers/employeeController');

const router = express.Router();

router.route('/').post( upload.single('image'), isVerifiedUser, addEmployee);
// router.post('/', upload.single('image'), isVerifiedUser, addEmployee);
router.route('/fetch').post(isVerifiedUser, getEmployees);
router.route('/remove').post(isVerifiedUser, removeEmployee);

router.route('/:id').put(isVerifiedUser, updateSalary);
router.put('/update/:id', upload.single('image'), isVerifiedUser, updateEmployee);


module.exports = router ;