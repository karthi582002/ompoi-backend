import express from "express";
import {registerBuyer} from "../../controller/buyer.controller/buyer.controller.js";

const router = express.Router();
router.post("/register",registerBuyer)

export default router;