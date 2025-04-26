import express from 'express';
import {
    agentLogout,
    aproveMerchantController,
    aproveOrderController,
    getAgentNotifications,
    getMerchantData,
    getPendingAgentTasks,
    getStatsForTasks,
    loginAgent,
    registerAgentController,
    test_join
} from "../../controller/agent.controller/agent_register.controller.js";
import req from "express/lib/request.js";
import {protectAgentRoute} from "../../middleware/protectRoute.js";

const router = express.Router();
router.post("/login", loginAgent);
router.get("/pending-merchant", protectAgentRoute,getPendingAgentTasks);
// router.get("pending-order", protectAgentRoute,getPendingOrderTasks);
router.post("/verify-merchant",protectAgentRoute,aproveMerchantController)
router.post("/verify-order",protectAgentRoute, aproveOrderController);
router.get("/notifications",protectAgentRoute,getAgentNotifications);
router.post("/logout",agentLogout);
router.get("/task-stats",protectAgentRoute,getStatsForTasks);
router.get("/merchant-data/:id",protectAgentRoute,getMerchantData);
// router.get("/",test_join)
router.get("/",protectAgentRoute,(req,res)=>{
    res.status(200).json({
        error : "Test Request"
    })
})
export default
router;