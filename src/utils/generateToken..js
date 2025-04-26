import jwt from 'jsonwebtoken'


export const generateMerchantToken = (merchentId,res) =>{
    try{
        console.log(merchentId);
        const token = jwt.sign({merchentId:merchentId,},process.env.JWT_SECRET,{expiresIn: '1hr'})
        res.cookie('merchant_jwt',token,{
            maxAge: 60*60*60*1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== 'development',
        });
    }catch(err){
        console.error(`Error generating token: ${err.message}`);
        throw new Error('Token generation failed'); // Pass the error to the main controller
    }
};

export const generateAgentToken = (agent_email,res) =>{
    try{
        const token = jwt.sign({agent_email:agent_email},process.env.JWT_AGENT_SECRET,{expiresIn: '1hr'})
        res.cookie('agent_jwt',token,{
            maxAge: 60*60*60*1000,
            // maxAge: 30*1000,
            httpOnly: true,
            sameSite: 'None',
            secure: process.env.NODE_ENV !== 'development',
        })
    }catch(err){
        console.error(`Error generating agent token: ${err.message}`);
        throw new Error('Token generation failed'); // Pass the error to the main controller
    }
}

export const generateAdminToken = (admin_email,res) =>{
    try{
        console.log(admin_email)
        const token = jwt.sign({admin_email:admin_email},process.env.JWT_ADMIN_SECRET,{expiresIn: '1hr'})
        res.cookie('admin_jwt',token,{
            maxAge: 60*60*60*1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== 'development',
        });
    }catch(err){
        console.error(`Error generating token: ${err.message}`);
        throw new Error('Token generation failed'); // Pass the error to the main controller
    }
}

export const generateBuyerToken = (buyer_email,res) =>{
    try{
            const token = jwt.sign({buyer_email: buyer_email},process.env.JWT_BUYER_SECRET,{expiresIn: '1hr'})
            res.cookie('buyer_jwt',token,{
                maxAge: 60*60*60*1000,
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV !== 'development',
            });
    }catch(err){
        console.error(`Error generating buyer token: ${err.message}`);
        res.status(500).json({
            error : "Internal Server Error"
        });
    }
}