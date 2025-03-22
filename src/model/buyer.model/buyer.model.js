import {db} from "../../config/db.js";
import {buyer_registration, orders, product_skus} from "../../db/schema.js";
import {and, or} from "drizzle-orm/sql/expressions/conditions";
import {eq,sql} from "drizzle-orm";


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

export const addOrders = async (data) => {
    console.log(data)
    return db.insert(orders).values({
        orderId:data.orderId,
        merchantId: data.merchantId,
        buyerEmail : data.buyerEmail,
        productId: data.productId,
        quantity: data.quantity,
        totalAmount: data.totalAmount,
        remarks:data.remarks || null,
    })
}

export const fetchAllOrdersByEmail = (buyerEmail) => {
    return db.select().from(orders)
        .where(eq(buyerEmail,orders.buyerEmail))
}

export const fetchSpecificOrderByOrderID = (orderId) => {
    return db.select().from(orders)
        .where(eq(orders.orderId,orderId),)
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