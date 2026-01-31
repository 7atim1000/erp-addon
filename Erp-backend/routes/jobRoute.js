const express = require('express');

const  { isVerifiedUser }  = require("../middlewares/tokenVerification");
const { addJob, getJobs, removeJob } = require('../controllers/jobController');

const router = express.Router();


router.route('/').post(isVerifiedUser, addJob);
router.route('/').get(isVerifiedUser, getJobs);
router.route('/remove').post(isVerifiedUser, removeJob);

module.exports = router ;