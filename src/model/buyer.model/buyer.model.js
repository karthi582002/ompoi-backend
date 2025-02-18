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

export const fetchAllOrdersByEmail = (buyerEmail) => {
    return db.select().from(orders)
        .where(eq(buyerEmail,orders.buyerEmail))
}

export const fetchSpecificOrderByOrderID = (buyerEmail,orderId) => {
    return db.select().from(orders)
        .where(and(
            eq(orders.buyerEmail,buyerEmail),
            eq(orders.orderId,orderId),
        ))
}

export const modifyQuantity = (quantity,productId) => {
    return db.update(product_skus)
        .set({
            quantity: sql`${product_skus.quantity} - ${quantity}`
        })
        .where(eq(
            product_skus.productId, productId
        ))
}