import express from 'express';
import {
    assignOrderVerificationToAgent,
    assignSellerToAgent,
    getAllAgents,
    getAllUnverifiedMerchants,
    getAllUnverifiedOrders, getMerchantRegistrationAnalytics,
    getMerchantVerifyTableData, getOrdersStatus,
    getOrdersVerifyTableData,
    loginAdmin,
    registerAdmin
} from "../../controller/admin.controller/admin.controller.js";
import {protectAdminRoute} from "../../middleware/protectRoute.js";
import {registerAgentController} from "../../controller/agent.controller/agent_register.controller.js";
const router = express.Router()

router.post("/register",registerAdmin);
router.post("/login",loginAdmin)
router.post("/assign-agent-seller",protectAdminRoute,assignSellerToAgent)
router.post("/assign-agent-order",protectAdminRoute,assignOrderVerificationToAgent)
router.post("/register-new-agent",protectAdminRoute, registerAgentController); // Handeled By admin
// fetch agent
router.get("/fetch-all-agents",protectAdminRoute,getAllAgents)
// fetch pending merchants
router.get("/fetch-all-unverified-merchants",protectAdminRoute,getAllUnverifiedMerchants)

// fetch pending orders
router.get("/fetch-all-unverified-orders",protectAdminRoute,getAllUnverifiedOrders)

// fetch tasks data for table
    // merchant verification
    router.get ("/merchant-verify-table",protectAdminRoute,getMerchantVerifyTableData)
    // orderVerification
    router.get ("/orders-verify-table",protectAdminRoute,getOrdersVerifyTableData)

// Statistics and summary box
router.get("/summary-analytics",protectAdminRoute,getMerchantRegistrationAnalytics)


// total order verified order
router.get("/orders-status",protectAdminRoute,getOrdersStatus)
//stats total agents,orders,

// today's sale is pending

// test
router.get("/",protectAdminRoute,(req,res)=> {
    const adminEmail = req.adminEmail;
    // const adminEmail = req.adminEmail;
    console.log(adminEmail)
    res.status(200).json({data:adminEmail});
})
export default router;