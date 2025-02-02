import express from "express";
import {register, checkUser, emailPassCheck} from "../controller/register.controller.js";

const router = express.Router();
router.post("/", register);
router.get("/checkuser", checkUser);
router.post("/status", emailPassCheck);

export default router;
