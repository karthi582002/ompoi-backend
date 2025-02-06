import jwt from 'jsonwebtoken';
import {getUserByEmail} from "../model/register.model.js";
import {getMerchantDetails} from "../model/merchant.model.js";
import {getAgent} from "../model/agent.model/agentRegister.model.js";

export const protectedMerchantRoute =async (req, res,next) => {
    try {
        const token = req.cookies.merchant_jwt;
        if(!token){
            return res.status(401).json({error : "Unauthorized No Token Provided"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({error : "Unauthorized Invalid Token"});
        }
        const merchant = await getMerchantDetails(decoded.merchentId);
        // console.log(merchant);
        if(!merchant){
            return res.status(401).json({error : "Merchant Not found Not Found"});
        }
        req.merchant = merchant;
        next();
    }catch(err){
        if(err.name === "TokenExpiredError"){
            return res.status(401).json({ error: "Session expired. Please log in again." });
        }
        console.log("Error in protectRouter:" + err );
        res.status(500).json({error : "Internal Server Error"});
    }
}

export const protectAgentRoute = async (req, res,next) => {
    try{
        const token = req.cookies.agent_jwt;
        if(!token){
            return res.status(401).json({error : "Unauthorized No Token"});
        }
        const decoded = jwt.verify(token,process.env.JWT_AGENT_SECRET);
        if(!decoded){
            return res.status(401).json({error : "Unauthorized Invalid Token"});
        }
        const agent = await getAgent(decoded.agent_email);
        console.log(agent);
        if(!agent){
            return res.status(401).json({error : "User Not Found"});
        }
        req.agent = agent;
        next();
    }catch(err){
        if(err.name === "TokenExpiredError"){
            return res.status(401).json({ error: "Session expired. Please log in again." });
        }
        console.log("Error in agent protectRouter:" + err );
        res.status(500).json({error : "Internal Server Error"});
    }
}