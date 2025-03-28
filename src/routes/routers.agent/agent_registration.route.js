import express from 'express';
import {
    aproveMerchantController,
    loginAgent,
    registerAgentController, test_join
} from "../../controller/agent.controller/agent_register.controller.js";
import req from "express/lib/request.js";
import {protectAgentRoute} from "../../middleware/protectRoute.js";

const router = express.Router();
router.post("/registration", registerAgentController);
router.post("/login", loginAgent);
router.post("/verify-merchant",protectAgentRoute,aproveMerchantController)
// router.get("/",test_join)
router.get("/",protectAgentRoute,(req,res)=>{
    res.status(200).json({
        error : "Not Found"
    })
})
export default
router;