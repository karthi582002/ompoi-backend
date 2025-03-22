import express from 'express';
import {
    assignOrderVerificationToAgent,
    assignSellerToAgent,
    loginAdmin,
    registerAdmin
} from "../../controller/admin.controller/admin.controller.js";
import {protectAdminRoute} from "../../middleware/protectRoute.js";
const router = express.Router()

router.post("/register",registerAdmin);
router.post("/login",loginAdmin)
router.post("/assign-agent-seller",protectAdminRoute,assignSellerToAgent)
router.post("/assign-agent-order",protectAdminRoute,assignOrderVerificationToAgent)
// test
router.get("/",protectAdminRoute,(req,res)=> {
    const adminEmail = req.adminEmail;
    // const adminEmail = req.adminEmail;
    console.log(adminEmail)
    res.status(200).json({data:adminEmail});
})
export default router;