import express from "express";
import {aboutMe, addProducts, forgetPassword, getMerchantId, merchantLogin} from "../controller/merchant.controller.js";
import {handleValidationErrors, protectedMerchantRoute} from "../middleware/protectRoute.js";
import {uploadProducts} from "../middleware/Cloudinary_Upload.js";
import {validateProduct} from "../utils/BodyValidation.js";

const router = express.Router();
router.post("/id", getMerchantId);
router.post("/login", merchantLogin);
router.post("/forget-password", forgetPassword,)
router.get("/me",protectedMerchantRoute,aboutMe)
router.post("/add-products",
    protectedMerchantRoute,
    uploadProducts.array('images',5),
    validateProduct,
    handleValidationErrors,
    addProducts,
)
export default router;