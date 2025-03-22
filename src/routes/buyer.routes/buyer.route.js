import express from "express";
import {
    buyerLogin, createOrder,
    fetchAllOrders,
    fetchSpecificOrder,
    registerBuyer
} from "../../controller/buyer.controller/buyer.controller.js";
import {fetchAllProducts, fetchSpecificProducts} from "../../controller/buyer.controller/product.controller.js";

const router = express.Router();
router.post("/register",registerBuyer)
router.post("/login",buyerLogin)
router.get("/all-products",fetchAllProducts)
router.get("/product/:id",fetchSpecificProducts)
router.post("/create-order",protectedBuyerRoute,createOrder)
router.get("/my-orders",protectedBuyerRoute,fetchAllOrders)
router.get("/my-orders/:id",protectedBuyerRoute,fetchSpecificOrder)

export default router;