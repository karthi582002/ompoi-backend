import express from 'express';
import {requestPayment, verifyPayment} from "../controller/payment.controller.js";

const router = express.Router();
// registration payment
router.post('/create-registration-order',requestPayment)
router.post('/verify-registration-order',verifyPayment)

// Order Payment
router.post('/create-order',protectedBuyerRoute,createOrderPayment)
router.post('/verify-order',protectedBuyerRoute,verifyOrderPayment)



export default router;