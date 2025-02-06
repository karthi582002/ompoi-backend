import express from "express";
import {getMerchantDetails} from "../controller/merchant.controller.js";

const router = express.Router();
router.post("/id", getMerchantDetails);
export default router;