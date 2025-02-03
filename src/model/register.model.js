import { db } from "../config/db.js";
import {merchant_registration, users} from "../db/schema.js";
import { eq } from "drizzle-orm";

export const createUser = async (name, email) => {
    return db.insert(users).values({name, email});
};

export const registerMerchant = async (data) => {
    return db.insert(merchant_registration).values({
        companyName: data.companyName,
        contactName: data.contactName,
        sellerCategory: data.sellerCategory,
        contactPhone: data.contactPhone,
        contactAltPhone: data.contactAltPhone,
        gstNumber: data.gstNumber,
        email: data.email,
        address: data.address,
        password: data.password, // Consider hashing the password before storing
        sellerDocuments: data.sellerDocuments
    });
}


export const getUserByEmail = async (email) => {
    return db.select().from(merchant_registration).where(eq(merchant_registration.email, email));
};

export const checkVerifiedStatus = async (email) => {
    return db.select({isVerified:merchant_registration.isVerified}).from(merchant_registration).where(eq(merchant_registration.email, email));
}
export const changeMerchantPassword = async (email,newPassword) => {
    return db.update(merchant_registration).
        set({password:newPassword})
        .where(eq(merchant_registration.email, email));
}