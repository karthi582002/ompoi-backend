import bcrypt from "bcrypt";
import {findBuyer, registerBuyerModel} from "../../model/buyer.model/buyer.model.js";

export const registerBuyer = async(req, res) => {
    try{
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const data = req.body;
        data.password = hashedPassword;

        const existingBuyerEmail = await findBuyer(data.contactEmail)
        if (existingBuyerEmail.length !== 0) {
            return res.status(400).send({error: 'Email already exists'});
        }

        const existingBuyerPhone = await findBuyer(data.contactPhone)
        if (existingBuyerPhone.length !== 0) {
            return res.status(400).send({error: 'Phone Number already exists'});
        }
        console.log(req.body)
        const result = await registerBuyerModel(req.body)
        return res.status(201).send(result);

    }catch (error){
        console.log("Error in Buyer Registration : "+ error);
        res.status(500).send({
            error: "Internal Server Error",
        })
    }
}

export const buyerLogin = async (req, res) => {
    try {
        // JD part
        // refer merchant login but no otp feature
    }catch (error){
        console.log("Error in Buyer Login: "+ error);
        res.status(500).send({error: "Internal Server Error"});
    }
}