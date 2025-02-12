import {db} from "../../config/db.js";
import {buyer_registration} from "../../db/schema.js";
import {or} from "drizzle-orm/sql/expressions/conditions";
import {eq} from "drizzle-orm";

export const findBuyer = (data) => {
    return db.select().from(buyer_registration)
        .where(or(
            eq(buyer_registration.contactEmail,data),
            eq(buyer_registration.contactPhone,data),
        ))
}

export const registerBuyerModel = (data) => {
    return db.insert(buyer_registration).values({
        companyName:data.companyName,
        contactName:data.contactName,
        contactEmail:data.contactEmail,
        password:data.password,
        contactPhone:data.contactPhone,
        billingAddress:data.billingAddress,
        shippingAddress:data.shippingAddress,
    })
}

export const getBuyer = (data) => {
    return db.select().from(buyer_registration)
    .where(or(
        eq(buyer_registration.contactEmail,data),
        eq(buyer_registration.contactPhone,data)
    ))
}