import {checkVerifiedStatus, getUserByEmail} from "../model/register.model.js";
import bcrypt from "bcrypt";
import Razorpay from "razorpay";
import crypto from "crypto";
import {addMerchantLogin, markMerchantPaidStatus, savePaymentDetails} from "../model/payment.model.js";
import {getMerchantID} from "../model/merchant.model.js";

export const requestPayment = async(req,res) => {
    try{
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
        // console.log(user[0].password);

        const isPasswordValid = await bcrypt.compare(password, user[0].password || "");

        if (!isPasswordValid) {
            return res.status(400).json({
                error: "Password is Incorrect",
            });
        }

        try {
            const status = await checkVerifiedStatus(email);
            const result = status[0]?.isVerified;
            // console.log(result)
            if(!result){
                return res.status(400).json({
                    error: "Your Not a  Verified Merchant "
                })
            }
        } catch (verificationError) {
            console.error("Error checking verification status:", verificationError);
            return res.status(500).json({
                error: "Internal Server Error while verifying status",
            });
        }
        // order calls
        const razorpay = new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        });
        const order = await razorpay.orders.create({
            amount: 100000,
            currency: "INR",
            receipt : `receipt_${Date.now()}`,
        })
        return res.status(200).json({
            order:order,
            companyName :user[0].companyName,
            name:user[0].contactName,
            phone:user[0].contactPhone,
            email:user[0].email
        })


    }catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Internal Server Error",
        })

    }
}


export const verifyPayment = async(req,res) => {
    try{
        const generateSignature = (
            razorpayOrderId,
            razorpayPaymentId,
        ) => {
            const keySecret = process.env.RAZORPAY_KEY_SECRET;
            return crypto
                .createHmac("sha256", keySecret)
                .update(razorpayOrderId + '|' + razorpayPaymentId)
                .digest("hex");
        };
        const {orderId,razorpayPaymentId,razorpaySignature,email,amount} = req.body;
        const decimalAmount = amount / 100;
        // console.log(decimalAmount);
        if (!orderId || !razorpayPaymentId || !razorpaySignature) {
            await savePaymentDetails({
                orderId,
                paymentId: razorpayPaymentId || "N/A",
                email,
                amount : decimalAmount,
                status: "FAILED",
            });
            return res.status(400).json({ message: "Missing payment details" });
        }


        const signature = generateSignature(orderId,razorpayPaymentId)
        if(!orderId || !razorpayPaymentId || !razorpaySignature){
            return res.status(400).json({
                "message" : "No Data.."
            })
        }
        if(signature !== razorpaySignature){
            await savePaymentDetails({
                orderId,
                paymentId: razorpayPaymentId,
                email,
                amount : decimalAmount,
                status: "FAILED",

            });
            return res.status(400).json({
                "message" : "Payment Failed"
            })
        }
        // db calls
        console.log(orderId);
        console.log(razorpayPaymentId);
        console.log(email)
        console.log(amount);
        const user = await getUserByEmail(email);
        await savePaymentDetails({
            orderId,
            paymentId: razorpayPaymentId,
            email,
            amount : decimalAmount,
            status: "SUCCESS",
        })

        await markMerchantPaidStatus(email); // marked isPaid in registration table
        let location = user[0]?.location;
        location = location.slice(0,3).toUpperCase();
        const randomNumber = Math.floor(10000 + Math.random() * 90000);
        const merchantID = location+randomNumber;
        await addMerchantLogin(merchantID,email,user[0].password)
        const finalMerchantId = await getMerchantID(email)
        return res.status(200).json({
            message: "Payment successful",
            orderId,
            paymentId: razorpayPaymentId,
            user: user[0].contactName,
            merchantID : finalMerchantId,
        });
    }catch (error) {
        console.log("Error in Payment : ",error)
        await savePaymentDetails({
            orderId: req.body.orderId || "N/A",
            paymentId: req.body.razorpayPaymentId || "N/A",
            email: req.body.email || "N/A",
            amount: (req.body.amount)/100 || 0,
            status: "FAILED",
        });
        return res.status(500).json({
            error: "Internal Server Error",
        })
    }
}