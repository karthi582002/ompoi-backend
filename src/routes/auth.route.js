import express from "express";
import {protectedBuyerRoute, protectedMerchantRoute} from "../middleware/protectRoute.js";
import {
    authCookieBuyer,
    authCookieMerchant,
    merchantLogout
} from "../controller/auth.controller/merchant.auth.controller.js";

const router = express.Router();
router.post("/logout",protectedMerchantRoute,merchantLogout)
router.get("/check-merchant",protectedMerchantRoute,authCookieMerchant)
router.get("/check-buyer",protectedBuyerRoute,authCookieBuyer)
export default router;