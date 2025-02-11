import express from "express";
import {buyerLogin, registerBuyer} from "../../controller/buyer.controller/buyer.controller.js";

const router = express.Router();
router.post("/register",registerBuyer)
router.post("/login",buyerLogin)

export default router;