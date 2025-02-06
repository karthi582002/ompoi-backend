import express from 'express';
import {requestPayment, verifyPayment} from "../controller/payment.controller.js";

const router = express.Router();
router.post('/create-order',requestPayment)
router.post('/verify-order',verifyPayment)

export default router;