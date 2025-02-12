import {body} from "express-validator";

export const validateProduct = [
    body("sku").notEmpty().withMessage("SKU is required"),
    body("grade").notEmpty().withMessage("Grade is required"),
    body("subGrade").notEmpty().withMessage("SubGrade is required"),
    body("origin").notEmpty().withMessage("Origin is required"),
    body("quality").notEmpty().withMessage("Quality is required"),
    body("color").notEmpty().withMessage("Color is required"),
    body("packing").notEmpty().withMessage("Packing type is required"),
    body("quantity").isNumeric().withMessage("Quantity must be a number"),
    body("unitPrice").isFloat({ gt: 0 }).withMessage("Unit Price must be a positive number"),
    body("moisture").notEmpty().isIn(["Yes","No"]).withMessage("Moisture is required"),
]