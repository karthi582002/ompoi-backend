import {
    addAdmin,
    addAgentNameToOrderTable,
    addAgentNotification,
    assignTaskToAgent,
    assignTaskToAgentOrders,
    checkMerchantInTaskTable,
    checkOrderInTaskTable,
    getAdminByEmail,
    getAllUnverifiedMerchantsFromDatabase,
    getAllUnverifiedOrdersFromDataBase,
    getMerchantVerifyTableDataFromDatabase, getOrdersSummary,
    getOrdersVerifyTableDataFromDatabase,
    getTotalAgents,
    getTotalOrders, getTotalRegistration, getTotalRevenue,
    getTotalSellers
} from "../../model/admin.model/admin.model.js";
import bcrypt from "bcrypt";
import {generateAdminToken} from "../../utils/generateToken..js";
import {getMerchantDetails, getMerchantID} from "../../model/merchant.model.js";
import {getAgentByEmail, getAllAgentsFromDatabase} from "../../model/agent.model/agentRegister.model.js";
import {getUserByEmail} from "../../model/register.model.js";
import {fetchSpecificOrderByOrderID} from "../../model/buyer.model/buyer.model.js";
import res from "express/lib/response.js";

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
            return res.status(401).send("Email and password is required");
        }
        const getAdmin = await getAdminByEmail(email)
        console.log(getAdmin);
        if (getAdmin?.length === 0) {
            return res.status(404).send("No Admin Found");
        }
        const isValid = await bcrypt.compare(password, getAdmin[0]?.adminPassword);
        if (!isValid) {
            return res.status(401).send("Invalid Admin Password");
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
            return res.status(409).json({
                error: "This Merchant already assigned. or Verified By Another Merchant"
            })
        }
        await assignTaskToAgent(data);
        const message = `Verify New Merchant ${merchant[0].companyName}`
        const taskName = "Merchant Verification"
        await addAgentNotification(agentEmail,taskName,message);
        res.status(201).json({
            success : "Task assigned successfully!"
        });
    }catch(err){
        console.log("Error in assigning task : " +err);
        return res.status(500).send("Internal Server Error");
    }
}
export const assignOrderVerificationToAgent = async (req, res) => {
    try{
        const {orderId,agentEmail} = req.body;
        if (!orderId){
            return res.status(400).send("Order ID is required");
        }
        const orderDetails = await fetchSpecificOrderByOrderID(orderId);
        // console.log(orderDetails);
        if (orderDetails.length === 0) {
            return res.status(404).json({
                error: "Order not found"
            })
        }
        const merchant = await getMerchantDetails(orderDetails[0].merchantId);
        const agent = await getAgentByEmail(agentEmail);
        if (merchant.length === 0) {
            return res.status(404).json({
                error: "Merchant not found"
            })
        }
        if (agent.length === 0){
            return res.status(404).json({
                error: "Agent Not found"
            })
        }

        const taskDetails = {
            merchantId : merchant[0].merchantId,
            agentEmail : agent[0].agent_email,
            orderId : orderDetails[0].orderId,
        }
        const existingOrder = await checkOrderInTaskTable(taskDetails.orderId)
        if (existingOrder.length > 0) {
            return res.status(400).json({
                error: "This order is alre" +
                    "y assigned to an agent"
            });
        }
        // console.log(taskDetails);
        await addAgentNameToOrderTable(agentEmail,orderId)
        await assignTaskToAgentOrders(taskDetails);
        res.status(200).send(taskDetails);
    }catch(err){
        console.log("Error in Admin Controlller " +err);
        return res.status(500).send("Internal Server Error");
    }
}

export const getAllAgents = async (req,res) => {
    try{
        const agents = await getAllAgentsFromDatabase(req,res);
        // console.log(agents)
        return res.status(200).send(agents);
    }catch(err){
        console.log("Error in getting all agents Admin Controller");
        return res.status(500).send("Internal Server Error");
    }
}


export const getAllUnverifiedMerchants = async(req,res) =>{
    try{
        const merchants = await getAllUnverifiedMerchantsFromDatabase();
        // console.log(merchants)
        return res.status(200).json(merchants);
    }catch (err) {
        console.log("Error in getting all unverified merchants Admin Controller");
        return res.status(500).json({"Error": "Internal Server Error"});
    }
}


export const getAllUnverifiedOrders = async(req,res) =>{
    try{
        const orders = await getAllUnverifiedOrdersFromDataBase();
        return res.status(200).send(orders);
    }catch(err){
        console.log("Error in getting all unverified orders Admin Controller");
        return res.status(500).send("Internal Server Error");
    }
}

export const getMerchantVerifyTableData = async(req,res) =>{
    try{
        const data = await getMerchantVerifyTableDataFromDatabase()
        // console.log(data)
        return res.status(200).send(data)
    }catch(err){
        console.log("Error In getting table data for merchant agent task", err)
        return res.status(500).send("Internal Server Error");
    }
}

export const getOrdersVerifyTableData = async(req,res) =>{
    try {
        const data = await getOrdersVerifyTableDataFromDatabase()
        console.log(data)
        res.status(200).send(data)
    }catch(err){
        console.log("Error in getting orders VerifyTableData for orders data", err);
        return res.status(500).send("Internal Server Error");
    }
}

export const getMerchantRegistrationAnalytics = async(req,res) =>{
    try{
        let totalAgents = await getTotalAgents();
        let totalOrders = await getTotalOrders();
        let totalSellers = await getTotalSellers();
        let totalRevenue = await getTotalRevenue();
        let totalRegistration = await getTotalRegistration();
        res.status(200).json({
            totalAgents : totalAgents,
            totalOrders : totalOrders,
            totalSellers : totalSellers,
            totalRevenue: totalRevenue,
            totalRegistration : totalRegistration,
        });
        console.log(totalAgents)
    }catch (err){
        console.log("Error in getting analytics for merchant registration",err);
        return res.status(500).send("Internal Server Error");
    }
}

export const getOrdersStatus = async(req,res) =>{
    try {
        const {totalOrders,totalVerifiedOrders} = await getOrdersSummary();
        res.status(200).json({
            totalOrders : totalOrders,
            totalVerifiedOrders : totalVerifiedOrders,
        });
    }catch (err){
        console.log("Error in getting analytics for orders ",err);
        return res.status(500).send("Internal Server Error");
    }
}