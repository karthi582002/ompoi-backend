import jwt from 'jsonwebtoken';
import {getUserByEmail} from "../model/register.model.js";

export const protectRoute =async (req, res,next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({error : "Unauthorized No Token Provided"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({error : "Unauthorized Invalid Token"});
        }
        const user = getUserByEmail(decoded.merchentId);
        if(!user){
            return res.status(401).json({error : "User Not Found"});
        }
        req.user = user;
        next();
    }catch(err){
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
        const agent = getUserByEmail(decoded.merchentId);
        if(!agent){
            return res.status(401).json({error : "User Not Found"});
        }
        req.agent = agent;
        next();
    }catch(err){
        console.log("Error in agent protectRouter:" + err );
        res.status(500).json({error : "Internal Server Error"});
    }
}