import twilio from "twilio";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config(); // Load .env variables

// Initialize Twilio Client globally
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendOtp = async (req, res) => {
    try {
        const { contactPhone } = req.body;

        if (!contactPhone) {
            return res.status(400).json({ success: false, error: "Phone number is required" });
        }

        const result = await client.verify.v2.services("VA035ad869bddea5c6b7532706ec95cefe")
            .verifications.create({
                channel: "sms",
                to: contactPhone,
            });

        console.log("OTP Sent:", result);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            sid: result.sid,
        });

    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({ success: false, error: "Failed to send OTP" });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { contactPhone, otp } = req.body;

        //Validate input
        if (!contactPhone || !otp) {
            return res.status(400).json({
                success: false,
                message: "Phone number and OTP are required",
            });
        }

        // Verify OTP with Twilio
        const result = await client.verify.v2
            .services("VA035ad869bddea5c6b7532706ec95cefe")
            .verificationChecks.create({
                to: contactPhone,
                code: otp,
            });

        console.log("OTP Verification Result:", result);

        // OTP Verified Successfully
        if (result.status === "approved") {
            const otpToken = jwt.sign({ contactPhone }, process.env.JWT_SECRET, { expiresIn: "5m" });
            res.cookie("otpToken", otpToken, {
                httpOnly: true,  // Prevent frontend JavaScript access
                secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
                sameSite: "Strict", // Prevent CSRF attacks
                maxAge: 5 * 60 * 1000, // 5 minutes
            });
            return res.status(200).json({ success: true, message: "OTP verified successfully" });
        }

        //  OTP Incorrect
        return res.status(400).json({
            success: false,
            message: "Invalid OTP. Please try again.",
        });

    } catch (error) {
        console.error("Error during OTP verification:", error);

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
};