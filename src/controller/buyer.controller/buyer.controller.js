import bcrypt from "bcrypt";
import {
    addOrders,
    fetchAllOrdersByEmail,
    fetchSpecificOrderByOrderID,
    findBuyer, modifyQuantity,
    registerBuyerModel
} from "../../model/buyer.model/buyer.model.js";
import {generateBuyerToken} from "../../utils/generateToken..js";
import {fetchSpecificProducts} from "./product.controller.js";
import {getProductByProductId} from "../../model/buyer.model/product.model.js";

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
        // console.log(req.body)
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

export const createOrder = async (req, res) => {
    try {
        const {productId,quantity,remarks} = req.body;
        const buyer = req.buyer;
        if (!productId || !quantity) {
            return res.status(400).json({ message: "Enter the Valid details" });
        }
        const product = await getProductByProductId(productId);
        if (product.length === 0) {
            return res.status(400).json({ message: "Product not found" });
        }
        if(quantity > product[0].quantity) {
            return res.status(401).json({ message: `We Have only ${product[0].quantity} products Left ` });
        }
        const totalAmount = quantity * product[0].unitPrice;
        const date = `${String(new Date().getDate()).padStart(2, "0")}${String(new Date().getMonth() + 1).padStart(2, "0")}${new Date().getFullYear()}`;
        const randomNumbers = Math.floor(1000 + Math.random()*9999).toString();
        // console.log(`${product[0].productId}-${date}-${buyer[0].id}-${randomNumbers}`)
        const orderId = `${product[0].productId}-${date}-${buyer[0].id}-${randomNumbers}`
        const data = {
            orderId:orderId,
            merchantId: product[0].merchantId,
            buyerEmail : buyer[0].contactEmail,
            productId,
            quantity,
            totalAmount,
            remarks:remarks || null,
        }
        await addOrders(data)
        await modifyQuantity(quantity,productId)
        res.status(201).send({
            message: "Order successfully created!",
            orderId:orderId,
        })
        console.log(data)
    }catch (error){
        console.log("Error While Creating New Order" + error)
        res.status(500).json({ message: "Internal Server Error" });
    }

}

export const fetchAllOrders = async (req, res) => {
    try {
        const buyer = req.buyer;
        const buyerEmail = buyer[0].contactEmail
        if (!buyerEmail || !buyerEmail.length) {
            return res.status(404).json({ message: "No Buyer Found" });
        }
        const allOrders = await fetchAllOrdersByEmail(buyerEmail);
        if(allOrders.length === 0){
            return res.status(404).json({ message: "No Orders Found Place Your First Order" });
        }
        res.status(200).json(allOrders);
    }catch (err){
        console.log(err);
        res.status(500).send({error: "Internal Server Error"});
    }
}

export const fetchSpecificOrder = async (req, res) => {
    try{
        const buyer = req.buyer;
        const orderId = req.params.id;
        console.log(orderId);
        const buyerEmail = buyer[0].contactEmail
        if (!buyerEmail || !buyerEmail.length) {
            return res.status(404).json({ message: "No Buyer Found" });
        }
        const specificOrder = await fetchSpecificOrderByOrderID(orderId);
        if(specificOrder.length === 0){
            return res.status(404).json({ message: "No Order Found Check Your Order ID" });
        }
        return res.status(200).json(specificOrder);
    }catch (err){
        console.log("Error While Fetching Specific Product" + err);
        res.status(500).send({error: "Internal Server Error"});
    }
}