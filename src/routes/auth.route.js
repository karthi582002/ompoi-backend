import express from "express";
import {protectAgentRoute, protectedBuyerRoute, protectedMerchantRoute} from "../middleware/protectRoute.js";
import {
    authCookieBuyer,
    authCookieMerchant,
    merchantLogout
} from "../controller/auth.controller/merchant.auth.controller.js";
import {authCookieAgent} from "../controller/agent.controller/agent_register.controller.js";

const router = express.Router();
router.post("/logout",protectedMerchantRoute,merchantLogout)
router.get("/check-merchant",protectedMerchantRoute,authCookieMerchant)
router.get("/check-buyer",protectedBuyerRoute,authCookieBuyer)
router.get("/check-agent",protectAgentRoute,authCookieAgent)
export default router;