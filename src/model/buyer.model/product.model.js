import {product_skus, sku_resources} from "../../db/schema.js";
import {eq} from "drizzle-orm";
import {db} from "../../config/db.js";
import {sql} from "drizzle-orm/sql/sql";

export const getAllProducts = () => {
    return db.select({
        id : product_skus.id,
        merchantId : product_skus.merchantId,
        productId : product_skus.productId,
        productGrade : product_skus.grade,
        subGrade : product_skus.subGrade,
        origin : product_skus.origin,
        color : product_skus.color,
        packing : product_skus.packing,
        unitPrice : product_skus.unitPrice,
        moisture : product_skus.moisture,
        productImage :sql`MIN(${sku_resources.photoUrl})`.as("productImage"),
    })
        .from(sku_resources)
        .leftJoin(product_skus,eq(product_skus.productId,sku_resources.productId))
        .groupBy(product_skus.id)
}

export const getProductByProductId = (id) => {
    return db.select()
        .from(product_skus)
        .where(
            eq(product_skus.productId,id)
        )
}

export const getProductImagesById = (id) => {
    return db.select({
        id : sku_resources.id,
        productImages: sku_resources.photoUrl
    }).from(sku_resources)
        .where(or(
            eq(sku_resources.productId,id),
            eq(sku_resources.id,id)
            )
        ).groupBy(sku_resources.productId,sku_resources.id)
}

export const getProductImagesByIdWithMerchantId = (id) => {
    return db.select({
        id : sku_resources.id,
        merchantId : sku_resources.merchantId,
        productImages: sku_resources.photoUrl
    })
        .from(sku_resources)
        .where(or(
                eq(sku_resources.productId,id),
                eq(sku_resources.id,id)
            )
        ).groupBy(sku_resources.productId,sku_resources.id)
}

export const updateProductsById = (productId,bodyData) => {
    return db.update(product_skus)
        .set({
            grade: bodyData.grade,
            subGrade: bodyData.subGrade,
            origin: bodyData.origin,
            quality: bodyData.quality,
            color: bodyData.color,
            packing: bodyData.packing,
            quantity: Number(bodyData.quantity),
            unitPrice: parseFloat(bodyData.unitPrice),
            moisture: bodyData.moisture,
            createdAt: new Date()
        })
        .where(
            eq(product_skus.productId,productId)
        )
}

export const deleteProductImageModel = (id) => {
    return db.delete(sku_resources)
        .where(
            eq(sku_resources.id,id)
        )
}