import {db} from "../../config/db.js";
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
