import {
    changeMerchantPassword,
    checkVerifiedStatus,
    createUser,
    getUserByEmail, getUserData,
    registerMerchant
} from "../model/register.model.js";
// import generateToken from "../utils/generateToken..js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as assert from "node:assert";
import {sendOtp} from "./otp.controller.js";
import twilio from "twilio";
import cloudinary from "cloudinary";
import cookieParser from "cookie-parser";
import multer from "multer"
import {CloudinaryStorage} from "multer-storage-cloudinary";


const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


// checks the user when register with unique email
export const checkUser = async(req,res) => {
    try {
        const {email,contactPhone} = req.body;
        console.log(req.body);
        if (!contactPhone && !email) {
            return res.status(404).json({
                message: 'Either email or phone is required',
            })
        }
        const data = email ? email : contactPhone;
        const user = await getUserData(data);
        console.log(user);
        if (user?.length === 0) {
            return res.status(200).json({
                success: true,
                error: "User not exists",
            })
        }
        res.status(409).json({
            message: "User already exists",
        })
    }catch(err) {
        console.error(err);
        res.status(500).json({
            error: "Error fetching user",
        })
    }
}

export const emailPassCheck = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password is required",
            });
        }
        
        const user = await getUserByEmail(email);
        
        if (!user || user.length === 0) {
            return res.status(404).json({
                error: "User Not Found",
            });
        }
        
        console.log(user[0].password);
        
        const isPasswordValid = await bcrypt.compare(password, user[0].password || "");
        
        if (!isPasswordValid) {
            return res.status(400).json({
                error: "Password is Incorrect",
            });
        }
        
        try {
            const status = await checkVerifiedStatus(email);
            const result = await getUserData(email);
            
            return res.status(200).json({ message: 'User status', result });
        } catch (verificationError) {
            console.error("Error checking verification status:", verificationError);
            return res.status(500).json({
                error: "Internal Server Error while verifying status",
            });
        }
        
    } catch (error) {
        console.error("Error in emailPassCheck:", error);
        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
};



export const register =  async (req, res) => {
    const salt = await bcrypt.genSalt(12);
    try {
        console.log("Received File:", req.file);
        console.log("Received Body:", req.body);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const fileUrl = req.file.path;

        const otpToken = req.cookies.otpToken;
        // console.log(req.cookies);
        const data = req.body;
        data.password = hashedPassword;
        if (!otpToken) {
            return res.status(401).json({ message: "OTP validation required" });
        }
        let phone;
        try {
            const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);
            phone = decoded.contactPhone;
            if(req.body.contactPhone !== phone) {
                return res.status(400).json({
                    error: "Invalid phone number",
                })
            }
        } catch (err) {
            console.log(err)
            return res.status(401).json({ message: "Invalid or expired OTP token" });
        }
        const userExist = await getUserByEmail(data.email);
        if (userExist.length !== 0) {
            return res.status(400).json({
                message: 'User already exists',
            })
        }
        req.body.contactPhone = phone;
        req.body.sellerDocuments = fileUrl;

        const result = await registerMerchant(req.body);
        // console.log(result);
        res.status(201).json({
            message: 'Register Successful',
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error adding user" });
    }
};

export const forgetPassword = async (req, res) => {
    try{
        const {email,newPassword,otp} = req.body;
        if (!email || !newPassword || !otp) {
            return res.status(400).json({
                error: "Enter all the Fields",
            })
        }
        const user = await getUserByEmail(email);
        if (user.lenght === 0) {
            return res.status(401).json({
                error: "User Not Found",
            })
        }
        const phoneNumber = user[0].contactPhone;
        console.log(phoneNumber);

        const result = await client.verify.v2
            .services("VA035ad869bddea5c6b7532706ec95cefe")
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
