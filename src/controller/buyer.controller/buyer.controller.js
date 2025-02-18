import bcrypt from "bcrypt";
import {findBuyer, registerBuyerModel} from "../../model/buyer.model/buyer.model.js";
import {generateBuyerToken} from "../../utils/generateToken..js";

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
/*

export const buyerLogin = async (req, res) => {
    try {
        // JD part
        // refer merchant login but no otp feature
    }catch (error){
        console.log("Error in Buyer Login: "+ error);
        res.status(500).send({error: "Internal Server Error"});
    }
}

import bcrypt from "bcrypt";
import { findBuyer } from "../../model/buyer.model/buyer.model.js";

export const buyerLogin=async(req, res)=>{
    try {
        const{email,password}=req.body;
        const existingBuyer=await findBuyer(email);
        if (existingBuyer.length === 0){
            return res.status(400).send({ error: "Invalid Email or Password" });
        }
        const isPasswordValid=await bcrypt.compare(password, existingBuyer[0].password);
        if (!isPasswordValid){
            return res.status(400).send({ error: "Invalid Email or Password" });
        }

        return res.status(200).send({ message: "Login Successful" });

    } catch (error){
        console.log("Error in Buyer Login: " + error);
        res.status(500).send({ error: "Internal Server Error" });
    }

}
*/
export const buyerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const getBuyer = await findBuyer(email);

        if (!getBuyer || getBuyer.length === 0) {
            return res.status(404).json({ message: "No Buyer Found" });
        }

        const buyer = getBuyer[0]; // Assuming first record is valid

        if (!buyer.password) {
            return res.status(500).json({ message: "Buyer record is incomplete" });
        }

        const isValid = await bcrypt.compare(password, buyer.password);

        if (!isValid) {
            return res.status(400).json({ message: "Invalid Buyer Password" });
        }

        // Generate Token (Assuming it sets a cookie)
        await generateBuyerToken(email, res);

        return res.status(200).json({ message: "Buyer successfully logged in!", buyer: { id: buyer.id, email: buyer.email } });

    } catch (err) {
        console.error("Error in Buyer Login:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};