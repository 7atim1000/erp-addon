const express = require('express');
const upload = require('../middlewares/multer')

const { signup, register, login, getUserData, logout, updateUserSalary, updateProfile, updateUserRole, getAllUsers } = require('../controllers/userController');
const { isVerifiedUser } = require('../middlewares/tokenVerification');
const router = express.Router();

// router.route('/register').post(register);
router.route('/register').post( upload.single('image'),  register);
// router.route('/signup').post( upload.single('image'),  signup);
router.route('/login').post(login);
router.route('/logout').post(isVerifiedUser, logout);
router.route('/').get(isVerifiedUser , getUserData);
router.route('/users').get(isVerifiedUser, getAllUsers)

router.put('/:userId/role', isVerifiedUser, updateUserRole);

router.route('/:empNo').put(isVerifiedUser, updateUserSalary)
router.put('/update/:id', upload.single('image'), isVerifiedUser, updateProfile);


module.exports = router;