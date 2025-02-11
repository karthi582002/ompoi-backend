export const authCookieMerchant = async(req, res) => {
    try{
        const merchant = req.merchant
        console.log("Auth.....  ")
        console.log(merchant[0].merchantId)
        res.status(200).json({merchant: merchant[0].merchantId})
    }catch(err){
        res.status(401).send({
            message:"Invalid Token",
        })
    }

}
export const merchantLogout = async(req, res) => {
    try{
        res.clearCookie("merchant_jwt",{
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        })
        return res.status(200).json({
            message: 'Merchant loggedOut',
        })
    }catch(err){
        res.status(401).send({
            error:"Unable to Logout.."
        })
    }
}