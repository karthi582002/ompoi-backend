import {getMerchantID} from "../model/merchant.model.js";

export const getMerchantDetails = async (req,res) => {
    try{
        const {email} = req.body;
        const id =  await getMerchantID(email);
        if (!id) {
            return res.status(404).json({
                message: 'Merchant not found',
            });
        }
        return res.status(200).json({
            message: 'Merchant details found',
            id:id,
        })
    }catch(err){
        console.error("Error checking verification status:", err)
        return res.status(500).json({
            error: "Internal Server Error while verifying status",
        })
    }
}