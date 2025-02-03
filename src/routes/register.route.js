import express from "express";
import {register, checkUser, emailPassCheck, forgetPassword} from "../controller/register.controller.js";

const router = express.Router();
router.post("/", register);
router.get("/checkuser", checkUser);
router.post("/status", emailPassCheck);
router.post("/forget-password", forgetPassword,)

export default router;
