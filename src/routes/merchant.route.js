import express from "express";
import {
    aboutMe,
    addProducts, changeStatus,
    forgetPassword,
    getMerchantId,
    merchantLogin,
    updateProducts
} from "../controller/merchant.controller.js";
import {handleValidationErrors, protectedMerchantRoute} from "../middleware/protectRoute.js";
import {uploadProducts} from "../middleware/Cloudinary_Upload.js";
import {updateOrderValidation, validateProduct} from "../utils/BodyValidation.js";
import {deleteProductImage} from "../controller/buyer.controller/product.controller.js";

const router = express.Router();
router.post("/id", getMerchantId);
router.post("/login", merchantLogin);
router.post("/forget-password", forgetPassword,)
router.get("/me",protectedMerchantRoute,aboutMe)
router.post("/add-products",
    protectedMerchantRoute,
    uploadProducts.array('images',3),
    validateProduct,
    handleValidationErrors,
    addProducts,
)
router.put("/update-product",
    protectedMerchantRoute,
    uploadProducts.array('images',3),
    validateProduct,
    handleValidationErrors,
    updateProducts
)
router.delete("/remove/image/:id",protectedMerchantRoute,deleteProductImage)
router.post("/update/order",protectedMerchantRoute,updateOrderValidation, handleValidationErrors ,changeStatus)
export default router;