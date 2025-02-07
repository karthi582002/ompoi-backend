import express from 'express';
import {loginAdmin, registerAdmin} from "../../controller/admin.controller/admin.controller.js";
import {protectAdminRoute} from "../../middleware/protectRoute.js";
const router = express.Router()

router.post("/register",registerAdmin);
router.post("/login",loginAdmin)
// test
router.get("/",protectAdminRoute,(req,res)=> {
    const adminEmail = req.adminEmail;
    // const adminEmail = req.adminEmail;
    console.log(adminEmail)
    res.status(200).json({data:adminEmail});
})
export default router;