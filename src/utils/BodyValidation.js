import {body} from "express-validator";

export const validateProduct = [
    body("sku").notEmpty().withMessage("SKU is required"),
    body("grade").isIn(["Raw", "kernels"]).withMessage("Grade is required"),
    
    body("subGrade")
        .custom((value, { req }) => {
            if (req.body.grade === "kernels") {
                if (!value) {
                    throw new Error("SubGrade is required for Kernels");
                }
                return true;
            } else if (req.body.grade === "Raw") {
                if (value) {
                    throw new Error("SubGrade must be null for Raw Cashew");
                }
                return true;
            }
            return true;
        }),
   // body("grade").notEmpty().isIn(["Raw","kernels"]).withMessage("Grade is required"),
    body("subGrade").notEmpty().isIn(["Null","W180","W210","W240","W320","W400","W mix","SW240","SW320","SSW","SW","DW","KW","OW","NW","JJH","JH","SJH","JH-2","LWP","LWP-2","JK","SWP","SP","SP-2","BB","BB-2","White Lolly"]).withMessage("SubGrade is required"),
    body("origin").notEmpty().isIn(["India","Benin","Togo","Benin","IVC","Tanzania","Conakry","Ogbomoso","Madagascar","Indonesia"]).withMessage("Origin is required"),
    body("quality").notEmpty().isIn(["Premium", "Good", "Average"]).withMessage("Quality is required"),
    body("color").notEmpty().isIn(["Light brown","Light ivory","Light ash-grey","Deep ivory","Yellow","Extra White","White","Pale ivory","Pale ash-grey","Light yellow"]).withMessage("Color is required"),
    body("packing").notEmpty().isIn(["20 Kgs Tin","20 kgs vaccum","10 Kgs bucket","10X1 kg"]).withMessage("Packing type is required"),
    body("quantity").isNumeric().withMessage("Quantity must be a number"),
    body("unitPrice").isFloat({ gt: 0 }).withMessage("Unit Price must be a positive number"),
    body("moisture").notEmpty().isIn(["Yes","No"]).withMessage("Moisture is required"),
]

export const validateMerchantRegistration = [
    body("companyName").notEmpty().withMessage("Company/Shop Name is required"),
    body("contactName").notEmpty().withMessage("Contact Name is required"),
    body("sellerType").isIn(["Farmer", "Manufacturer", "Importer", "Whole Seller"]).withMessage("Invalid Seller Type"),
    body("sellerCategory").isIn(["Platinum", "Gold", "Silver"]).withMessage("Invalid Seller Category"),
    body("mobileNumber").notEmpty().isMobilePhone().withMessage("Valid Contact Mobile Number is required (OTP verification)"),
    body("alternateMobileNumber").optional().isMobilePhone().withMessage("Invalid Alternate Mobile Number"),
    body("gstNo").notEmpty().withMessage("GST Number is required"),
    body("email").isEmail().withMessage("Valid Email is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("documents").notEmpty().withMessage("At least one document (PDF) is required"),
];
