import {fetchSpecificOrderByOrderID} from "../../model/buyer.model/buyer.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import {
    addMerchantLogin,
    changePaymentStatus,
    markMerchantPaidStatus,
    savePaymentDetails,
    trackPayment
} from "../../model/payment.model.js";
import {getUserByEmail} from "../../model/register.model.js";
import {getMerchantID} from "../../model/merchant.model.js";

export const createOrderPayment = async (req,res)=>{
    try {
        const buyer = req.buyer;
        console.log(buyer);
        const orderId = req.body.orderId;
        const buyerEmail = buyer[0]?.contactEmail
        const specificOrder = await fetchSpecificOrderByOrderID(orderId);
        console.log(specificOrder);
        if(buyerEmail !==specificOrder[0].buyerEmail){
            return res.status(401).json({
                message: "This Order Doesn't Belong to You",
            })
        }
        // order calls
        const razorpay = new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        });

        const order = await razorpay.orders.create({
            amount: specificOrder[0].totalAmount * 100,
            currency: "INR",
            receipt : `receipt_${orderId}`,
        })
        return res.status(200).json({
            order: order,
            orderId:orderId,
            merchantId:specificOrder[0].merchantId,
            buyerName:buyer[0].contactName,
            contactPhone:buyer[0].contactPhone,
            contactEmail:buyer[0].contactEmail,
            billingAddress:buyer[0].billingAddress,
            shippingAddress:buyer[0].shippingAddress,
        })

    }catch(err){
        console.log("Error While Creating Order Payment in Buyer Controller "+err);
        return res.status(500).json({
            error: "Internal Server Error while verifying status",
        });
    }
}


export const verifyOrderPayment = async(req,res) => {
    try{
        const buyer = req.buyer;
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
        const {razorpayOrderId,razorpayPaymentId,razorpaySignature,orderId,amount} = req.body;
        console.log(razorpayOrderId);
        console.log(razorpayPaymentId);
        console.log(orderId)
        console.log(amount);
        const decimalAmount = amount / 100;
        // console.log(decimalAmount);
        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            await trackPayment({
                orderId,
                paymentId: razorpayPaymentId || "N/A",
                amount: amount,
                status: "Failed",
                buyerEmail: buyer[0].contactEmail,
            });
            return res.status(400).json({ message: "Missing payment details" });
        }
        const signature = generateSignature(razorpayOrderId,razorpayPaymentId)
        if(!razorpayOrderId || !razorpayPaymentId || !razorpaySignature){
            return res.status(400).json({
                "message" : "No Data.."
            })
        }
        if(signature !== razorpaySignature){
            await trackPayment({
                orderId,
                paymentId: razorpayPaymentId || "N/A",
                amount: amount,
                status: "Failed",
                buyerEmail: buyer[0].contactEmail,
            });
            return res.status(400).json({
                "message" : "Payment Failed"
            })
        }
        // db calls
        console.log(orderId);
        console.log(razorpayPaymentId);
        console.log(orderId)
        console.log(amount);
        await trackPayment({
            orderId,
            paymentId: razorpayPaymentId || "N/A",
            amount: amount,
            status: "SUCCESS",
            buyerEmail: buyer[0].contactEmail,
        });
        await  changePaymentStatus(orderId);
        // await markMerchantPaidStatus(email); // marked isPaid in registration table
        // let location = user[0]?.location;
        // location = location.slice(0,3).toUpperCase();
        // const randomNumber = Math.floor(10000 + Math.random() * 90000);
        // const merchantID = location+randomNumber;
        // await addMerchantLogin(merchantID,email,user[0].password)
        // const finalMerchantId = await getMerchantID(email)
        return res.status(200).json({
            message: "Payment successful",
            orderId,
            paymentId: razorpayPaymentId,
        });
    }catch (error) {
        console.log("Error in Payment : ",error)
        return res.status(500).json({
            error: "Internal Server Error",
        })
    }
}
