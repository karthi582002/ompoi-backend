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
    return db.select({productImages: sql`JSON_ARRAYAGG(${sku_resources.photoUrl})`.as("productImages")})
        .from(sku_resources)
        .where(
            eq(sku_resources.productId,id)
        ).groupBy(sku_resources.productId)
}