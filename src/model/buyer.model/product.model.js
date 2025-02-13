
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