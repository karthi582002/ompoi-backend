import bcrypt from "bcrypt";
import {
    approveMerchant,
    getAgentByEmail,
    insertVerifiedMerchant,
    registerAgent, selectData
} from "../../model/agent.model/agentRegister.model.js";
import {generateAgentToken} from "../../utils/generateToken..js";
import {getUserByEmail} from "../../model/register.model.js";
import {verified_merchant} from "../../db/schema.js";

export const registerAgentController = async (req,res) => {
    try{
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(req.body.agent_password, salt);
        const agent_data = req.body;
        agent_data.agent_password = hashedPassword;
        const exist_agent = await getAgentByEmail(agent_data.agent_email);
        console.log(exist_agent);
        if (exist_agent.length !== 0) {
            return res.status(400).json({
                message: 'Agent already exists',
            })
        }
        const result = await registerAgent(agent_data);
        console.log(result);
        return res.status(201).json({
            message: 'Agent Created successfully',
        })
    }catch (error){
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error",
        })
    }
}

export const loginAgent = async (req,res) => {
    try{
        const {agent_email, agent_password} = req.body;
        if(!agent_email || !agent_password){
            return res.status(400).json({
                message: 'Incorrect email or password',
            })
        }
        const agent = await getAgentByEmail(agent_email);
        if(agent.length === 0){
            return res.status(404).json({
                message: 'User Not Found',
            })
        }
        const isPasswordValid = await  bcrypt.compare(agent_password,agent[0].agent_password || " " );
        if(!isPasswordValid){
            return res.status(400).json({
                message: 'Incorrect password',
            })
        }
        generateAgentToken(agent_email,res);
        return res.status(200).json({
            message: 'Agent Login Successfully',
        })
    }catch(error){
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error",
        })
    }
}

export const aproveMerchantController = async (req,res) => {
   try{
       const {merchant_email,agent_email} = req.body;
       const data = req.body;
       const user = await getUserByEmail(agent_email);
       const agent = await getAgentByEmail(merchant_email);
       // console.log(user);
       // const agent_name = agent[0].agent_name;
       // const user_email = user[0].email;
       if(user.length !== 0 || agent.length !== 0){
           return res.status(401).json({
               message: 'Unauthorized',
           })
       }
       await insertVerifiedMerchant(data);
       await approveMerchant(agent_email,merchant_email);
       res.status(200).json({
           message: 'Merchant Approved Successfully',
       })
   } catch (err){
       console.log(err)
       res.status(500).json({
           message: "Internal Server Error",
       })
    }
}

export const test_join = async (req, res) => {
    try {
        const result = await selectData(); // Fetch data from DB
        console.log("Fetched Data:", result);

        // If no data is found, send a meaningful response
        if (!result || result.length === 0) {
            return res.status(404).json({ message: "No records found" });
        }

        // Send successful response
        return res.status(200).json({
            // success: true,
            data: result
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
