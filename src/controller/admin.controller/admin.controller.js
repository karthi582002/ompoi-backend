import {
    addAdmin,
    assignTaskToAgent,
    checkMerchantInTaskTable,
    getAdminByEmail
} from "../../model/admin.model/admin.model.js";
import bcrypt from "bcrypt";
import {generateAdminToken} from "../../utils/generateToken..js";
import {getMerchantDetails, getMerchantID} from "../../model/merchant.model.js";
import {getAgentByEmail} from "../../model/agent.model/agentRegister.model.js";
import {getUserByEmail} from "../../model/register.model.js";

export const registerAdmin = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and password is required");
        }
        const salt = await bcrypt.genSalt(15);
        const hashedPassword = await bcrypt.hash(password, salt);
        const result = await addAdmin(email, hashedPassword);
        if (!result) {
            return res.status(400).send("Email and password is required");
        }
        return res.status(201).send("Admin successfully registered!");
    }catch(err){
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
}

export const loginAdmin = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and password is required");
        }
        const getAdmin = await getAdminByEmail(email)
        console.log(getAdmin);
        if (!getAdmin) {
            return res.status(404).send("No Admin Found");
        }
        const isValid = await bcrypt.compare(password, getAdmin[0].adminPassword);
        if (!isValid) {
            return res.status(400).send("Invalid Admin Password");
        }
        await generateAdminToken(getAdmin[0].adminEmail,res)
        res.status(201).send("Admin successfully logged in!");
    }catch(err){
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
}

export const assignSellerToAgent = async (req, res) => {
    try{
        const {agentEmail,merchantEmail} = req.body;
        const merchant = await getUserByEmail(merchantEmail);
        const agent = await getAgentByEmail(agentEmail)
        // console.log(merchant);
        if(merchant.length === 0) {
            return res.status(404).json({
                error: "Merchant not registered"
            });
        }
        if(agent.length === 0){
            return res.status(404).json({
                error: "Agent not registered"
            });
        }
        const data = {
            merchantName : merchant[0].companyName,
            merchantEmail : merchant[0].email,
            agentName : agent[0].agent_name,
            agentEmail : agent[0].agent_email,
        }
        const existingMerchant = await checkMerchantInTaskTable(data.merchantEmail)
        if(existingMerchant.length !== 0){
            return res.status(404).json({
                error: "This Merchant already assigned."
            })
        }
        await assignTaskToAgent(data);
        res.status(201).json({
            success : "Task assigned successfully!"
        });
    }catch(err){
        console.log("Error in assigning task : " +err);
        return res.status(500).send("Internal Server Error");
    }
}