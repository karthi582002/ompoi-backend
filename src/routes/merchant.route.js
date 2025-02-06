import express from "express";
import {aboutMe, forgetPassword, getMerchantId, merchantLogin} from "../controller/merchant.controller.js";
import {protectedMerchantRoute} from "../middleware/protectRoute.js";

const router = express.Router();
router.post("/id", getMerchantId);
router.post("/login", merchantLogin);
router.post("/forget-password", forgetPassword,)
router.get("/me",protectedMerchantRoute,aboutMe)
export default router;