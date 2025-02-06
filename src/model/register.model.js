import { db } from "../config/db.js";
import {merchant_registration, users} from "../db/schema.js";
import { eq } from "drizzle-orm";
import {or} from "drizzle-orm/sql/expressions/conditions";

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
        location: data.location,
        address: data.address,
        password: data.password, // Consider hashing the password before storing
        sellerDocuments: data.sellerDocuments
    });
}


export const getUserByEmail = async (email) => {
    return db.select().from(merchant_registration).where(eq(merchant_registration.email, email));
};

export const getUserData = async (data) => {
    return db
        .select({
            id: merchant_registration.id,
            companyName: merchant_registration.companyName,
            contactName: merchant_registration.contactName,
            sellerCategory: merchant_registration.sellerCategory,
            contactPhone: merchant_registration.contactPhone,
            contactAltPhone: merchant_registration.contactAltPhone,
            gstNumber: merchant_registration.gstNumber,
            email: merchant_registration.email,
            location: merchant_registration.location,
            address: merchant_registration.address,
            sellerDocuments: merchant_registration.sellerDocuments,
            isVerified: merchant_registration.isVerified,
            isPaid: merchant_registration.isPaid
        })
        .from(merchant_registration)
        .where(or(eq(merchant_registration.email, data),eq(merchant_registration.contactPhone, data)));
}

export const checkVerifiedStatus = async (email) => {
    return db.select({isVerified:merchant_registration.isVerified}).from(merchant_registration).where(eq(merchant_registration.email, email));
}
