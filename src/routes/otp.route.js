import express from "express";
import {checkUser} from "../controller/register.controller.js";
import {sendOtp, verifyOtp} from "../controller/otp.controller.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
router.post("/",sendOtp);
router.post("/verify-otp", verifyOtp);

export default router;