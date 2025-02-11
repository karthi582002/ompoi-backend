import express from "express";
import {protectedMerchantRoute} from "../middleware/protectRoute.js";
import {authCookieMerchant, merchantLogout} from "../controller/auth.controller/merchant.auth.controller.js";

const router = express.Router();
router.post("/logout",protectedMerchantRoute,merchantLogout)
router.get("/check-merchant",protectedMerchantRoute,authCookieMerchant)
export default router;