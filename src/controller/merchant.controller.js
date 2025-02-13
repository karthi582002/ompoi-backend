import {
    addProductFieldsToDB, addProductImagesToDB,
    changeMerchantPassword,
    getMerchantDetails,
    getMerchantID,
    merchantProfile
} from "../model/merchant.model.js";
import bcrypt from "bcrypt";
import {generateMerchantToken} from "../utils/generateToken..js";
import {getUserByEmail} from "../model/register.model.js";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// getting merchant id to display in frontend
export const getMerchantId = async (req,res) => {
    try{
        const {email} = req.body;
        const id =  await getMerchantID(email);
        if (!id) {
            return res.status(404).json({
                message: 'Merchant not found',
            });
        }
        return res.status(200).json({
            message: 'Merchant details found',
            id:id,
        })
    }catch(err){
        console.error("Error checking verification status:", err)
        return res.status(500).json({
            error: "Internal Server Error while verifying status",
        })
    }
}

// reset password
export const forgetPassword = async (req, res) => {
    try{
        const {email,newPassword,otp} = req.body;
        if (!email || !newPassword || !otp) {
            return res.status(400).json({
                error: "Enter all the Fields",
            })
        }
        const user = await getUserByEmail(email);
        if (user.length === 0) {
            return res.status(401).json({
                error: "User Not Found",
            })
        }
        const phoneNumber = user[0].contactPhone;
        console.log(phoneNumber);

        const result = await client.verify.v2
            .services(process.env.TWILIO_SERVICE_ID)
            .verificationChecks.create({
                to: phoneNumber,
                code: otp,
            });
        if (result.status === "approved") {
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            await changeMerchantPassword(email, hashedPassword);

            return res.status(200).json({
                message: 'Password Changed Successfull',
            })
        }
        return res.status(400).json({
            success: false,
            message: "Invalid OTP. Please try again.",
        });
    } catch (error) {
        console.error("Error in OTP verification:", error);
        // Handle Twilio-specific errors
        if (error.code === 20404) {
            return res.status(404).json({
                success: false,
                message: "Verification service not found. Check the Service SID.",
                moreInfo: error.moreInfo,
            });
        }

        // Handle Rate Limit Exceeded
        if (error.code === 60203) {
            return res.status(429).json({
                success: false,
                message: "Too many incorrect OTP attempts. Please wait and try again.",
            });
        }

        // General server error
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

// merchant Login Phase
export const merchantLogin = async (req,res) => {
    try{
        const {merchantId,password} = req.body;
        if(!merchantId && !password){
            return res.status(401).json({
                error: 'Invalid Merchant ID and password To Login',
            })
        }
        const merchant = await getMerchantDetails(merchantId);
        if(!merchant){
            return res.status(404).json({
                error: 'Invalid Merchant Id'
            })
        }
        const isPasswordVerified = await bcrypt.compare(password,merchant[0]?.password || " ");
        // console.log(merchant)
        if(!isPasswordVerified){
            return res.status(401).json({
                error: 'Invalid Password',
            })
        }
        generateMerchantToken(merchant[0]?.merchantId, res)
        return res.status(200).json({
            message: 'Merchant loggedIn',
        })
    }catch(err){
        console.error("Error checking verification status:", err)
        return res.status(500).json({
            error: "Internal Server Error while Logging",
        })
    }

}

export const aboutMe = async (req, res) => {
    // console.log(req.merchant[0].merchantId)
    try {
        const merchant = req.merchant
        const email = merchant[0].merchantEmail;
        console.log(email)
        const data = await merchantProfile(email)
        return res.status(200).json({
            data: data,
        })
    }catch(err){
        console.error("Error Getting Profile:", err)
        return res.status(500).json({})
    }
}

export const addProducts = async (req, res) => {
    try {
        if(req.files.length)
        console.log("Files received: ", req.files); // Debugging
        const bodyData = JSON.parse(JSON.stringify(req.body));
        console.log("Body Data: ", bodyData);
        const merchantId = req.merchant?.[0]?.merchantId;
        const email = req.merchant?.[0]?.merchantEmail;
        const C_images = req.files;
        console.log(C_images);
        // add the fields to the DB
        try{
            await addProductFieldsToDB({
                merchantId:merchantId,
                bodyData:bodyData,
            })
        }catch (error) {
            console.error("Insert Error:", error);
            return res.status(500).json({ success: false, error: error.message });
        }
        try {
            // Add the images to a table
            if (C_images && C_images.length > 0) {
                for(const image of C_images) {
                    const imageCloudinaryLink = image.path;
                    console.log("C_image:", imageCloudinaryLink);
                    if (imageCloudinaryLink.length > 0) {
                        await addProductImagesToDB({
                            merchantId,
                            productId:bodyData.sku,
                            photoUrl:imageCloudinaryLink,
                        });
                    }
                }
            }
        }catch(err){
            console.error("Error adding Product Image : ", err)
            return res.status(500).json({
                error: "Error while adding image",
            })

        }

        return res.status(201).json({
            message: "Product and images added successfully",
            email,
            C_images
        });
    } catch (err) {
        console.error("Error in addProducts:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateProducts = async (req, res) => {
    try{
        const productId = req.params.productId;
        const bodyData = JSON.parse(JSON.stringify(req.body));
        bodyData.quantity = Number(bodyData.quantity);
        bodyData.unitPrice = Number(bodyData.unitPrice);
        if(isNaN(bodyData.quantity)){
            console.log("bodyData.unitPrice")
        }
        const merchantId = req.merchant?.[0]?.merchantId;
        const C_images = req.files;
        console.log(bodyData);

        const existingProduct = await getProductByProductId(productId);
        if(existingProduct.length === 0){
            return res.status(404).json({ error: "Product not found" });
        }
        try{
            await updateProductsById(productId, bodyData);
        }catch (err){
            console.error("Error updating Product: ", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        try {
            // Add the images to a table
            if (C_images && C_images.length > 0) {
                for(const image of C_images) {
                    const imageCloudinaryLink = image.path;
                    console.log("C_image:", imageCloudinaryLink);
                    if (imageCloudinaryLink.length > 0) {
                        await addProductImagesToDB({
                            merchantId,
                            productId:bodyData.sku,
                            photoUrl:imageCloudinaryLink,
                        });
                    }
                }
            }
        }catch(err){
            console.error("Error adding Product Image : ", err)
            return res.status(500).json({
                error: "Error while adding image",
            })
        }
        res.status(200).json({
            message: "Product updated successfully",
        })
    }catch(err){
        console.error("Error updating Products for update:", err);
    }
}
