import {db} from "../config/db.js";
import {approved_merchant, merchant_registration} from "../db/schema.js";
import {eq} from "drizzle-orm";
import app from "../app.js";

export const getMerchantID = async (email) => {
    return db.select({merchantId:approved_merchant.merchantId})
        .from(approved_merchant)
        .where(eq(approved_merchant.merchantEmail,email));
}

export const getMerchantDetails = async (merchantId) => {
    return db.select()
        .from(approved_merchant)
        .where(eq(approved_merchant.merchantId,merchantId));
}

export const changeMerchantPassword = async (email,newPassword) => {
    return db.update(approved_merchant).
    set({password:newPassword})
        .where(eq(approved_merchant.merchantEmail, email));
}
export const merchantProfile = async (email) => {
    try {
        const data = await db.select({
            merchant_Id: approved_merchant.merchantId,
            merchant_name: merchant_registration.contactName,
            merchant_company: merchant_registration.companyName,
            merchant_email: approved_merchant.merchantEmail,
            merchant_phone: merchant_registration.contactPhone,
            merchant_category: merchant_registration.sellerCategory,
            merchant_gst: merchant_registration.gstNumber,
            merchant_location: merchant_registration.location,
            merchant_address: merchant_registration.address,
            merchant_documents: merchant_registration.sellerDocuments,
        })
            .from(approved_merchant)
            .leftJoin(
                merchant_registration,
                eq(approved_merchant.merchantEmail, merchant_registration.email)
            )
            .where(eq(merchant_registration.email,email))
// Filter by email

        // Check if data was retrieved
        if (!data || data.length === 0) {
            console.log("No merchant found for this email:", email);
            return null;
        }

        return data;
    } catch (error) {
        console.error("Error fetching merchant profile:", error);
        throw new Error("Error fetching merchant profile"); // Ensure the error is properly thrown
    }
};
