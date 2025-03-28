import {db} from "../config/db.js";
import {approved_merchant, merchant_registration, product_skus, sku_resources} from "../db/schema.js";
import {eq} from "drizzle-orm";
import app from "../app.js";
import {or} from "drizzle-orm/sql/expressions/conditions";

export const getMerchantID = async (email) => {
    return db.select({merchantId:approved_merchant.merchantId})
        .from(approved_merchant)
        .where(eq(approved_merchant.merchantEmail,email));
}

export const getMerchantDetails = async (data) => {
    return db.select()
        .from(approved_merchant)
        .where(
            or(
                eq(approved_merchant.merchantId,data),
                eq(approved_merchant.merchantEmail,data)
            )
        );
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
//now
export const addProductFieldsToDB = async ({merchantId, bodyData}) => {
    return  db.insert(product_skus).values({
        merchantId: merchantId,
        productId: bodyData.sku,
        grade: bodyData.grade, // ✅ Explicitly ensure this field is included
        subGrade: bodyData.subGrade || null, // ✅ Handle nullable field correctly
        origin: bodyData.origin,
        quality: bodyData.quality,
        color: bodyData.color || null, // ✅ If color is optional, default to null
        packing: bodyData.packing,
        quantity: Number(bodyData.quantity), // ✅ Ensure it's an integer
        unitPrice: parseFloat(bodyData.unitPrice), // ✅ Ensure it's a decimal
        moisture: bodyData.moisture,
        createdAt: new Date() // ✅ Ensure timestamp is explicitly set if needed
    });
};

// Function to add product images to the database
export const addProductImagesToDB = async ({merchantId,productId,photoUrl}) => {
    console.log(photoUrl + "From Model");
    return db.insert(sku_resources).values({
        merchantId: merchantId,
        productId: productId,
        photoUrl: photoUrl,
    });
};

