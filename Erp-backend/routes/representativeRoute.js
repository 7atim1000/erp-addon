const express = require('express');
const { addRepresentative, getRepresentative, removeRepresentative } = require('../controllers/representativeController');

const router = express.Router();


router.route('/').post(addRepresentative)
router.route('/').get(getRepresentative)
router.route('/remove').post(removeRepresentative)

module.exports = router ;