//import { addOrder, getOrders, getOrder, updateOrder } from "../controllers/orderController";
//import { isVerifiedUser } from "../middlewares/tokenVerification";

const express = require('express');

const  { isVerifiedUser }  = require("../middlewares/tokenVerification");
const { addOrder, getOrders, getOrderById, updateOrder, extraOrder } = require("../controllers/orderController");

const router = express.Router();

router.route('/').post(isVerifiedUser, addOrder);
router.route('/').get(getOrders);
router.route('/:id').get(isVerifiedUser, getOrderById);
router.route('/:id').put(isVerifiedUser, updateOrder);

router.route('/:id').post(isVerifiedUser, extraOrder);

module.exports = router ;
