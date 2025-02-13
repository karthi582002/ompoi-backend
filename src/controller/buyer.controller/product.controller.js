import {
    getAllProducts,
    getProductByProductId, getProductImagesById
} from "../../model/buyer.model/product.model.js";

export const fetchAllProducts = async(req,res)=>{
    // const merchantId = req.merchant[0]?.merchantId;
    try{
        const products = await getAllProducts()
        res.status(200).json(products)
    }catch(err){
        console.log("Error while Fetching Products : "+err);
        res.status(500).send({
            error: "Internal Server Error",
        });

    }
}

export const fetchSpecificProducts = async(req,res)=>{
    try {
        const {id} = req.params;
        const productData = await getProductByProductId(id)
        if(productData.length === 0){
            return res.status(404).send({
                error: "Product not found",
            })
        }
        const productImages = await getProductImagesById(id)
        console.log()
        const finalData = {
            productData: productData,
            productImages: productImages[0].productImages,
        };
        res.status(200).json(finalData);
    }catch(err){
        console.log("Error while Fetching Specific Products : "+err);
        res.status(500).send({
            error: "Internal Server Error",
        })
    }
}

export const deleteProductImage = async (req, res) => {
    try {
        const imageId = req.params.id
        const imageCheck = await getProductImagesByIdWithMerchantId(imageId)
        const merchantId = req.merchant?.[0].merchantId;
        if (imageCheck.length === 0 ) {
            return res.status(404).send({
                error: "Image not found",
            })
        }
        if(merchantId !== imageCheck[0].merchantId){
            return res.status(401).send({
                error: "This Image not belong to you",
            })
        }
        await deleteProductImageModel(imageId);
        res.status(200).send({
            message : "Image deleted",
        })
    }catch(err){
        console.log("Error while Deleting Image: "+err);
        res.status(500).send({
            error: "Internal Server Error",
        })
    }
}

