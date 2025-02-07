import express from "express";
import {aboutMe, addProducts, forgetPassword, getMerchantId, merchantLogin} from "../controller/merchant.controller.js";
import {protectedMerchantRoute} from "../middleware/protectRoute.js";

const router = express.Router();
router.post("/id", getMerchantId);
router.post("/login", merchantLogin);
router.post("/forget-password", forgetPassword,)
router.get("/me",protectedMerchantRoute,aboutMe)
router.post("/add-products",protectedMerchantRoute,addProducts)
export default router;