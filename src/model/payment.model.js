import {db} from "../config/db.js";
import {approved_merchant, merchant_registration, order_payments, orders, registration_payment} from "../db/schema.js";
import {eq} from "drizzle-orm";

export const savePaymentDetails = async (data) => {
    return db.insert(registration_payment).values([data])
}

export const markMerchantPaidStatus = async (email) => {
    return db.update(merchant_registration).
        set({isPaid: true})
        .where(eq(merchant_registration.email, email))
}

export const addMerchantLogin = async (merchantId, email, password) => {
    return db.insert(approved_merchant).values({
        merchantId,
        merchantEmail: email,
        password,
    })
}