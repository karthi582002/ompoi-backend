import express from "express";
import {buyerLogin, registerBuyer} from "../../controller/buyer.controller/buyer.controller.js";

const router = express.Router();
router.post("/register",registerBuyer)
router.post("/login",buyerLogin)
router.get("/all-products",fetchAllProducts)
router.get("/product/:id",fetchSpecificProducts)

export default router;