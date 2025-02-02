import jwt from 'jsonwebtoken'


export const generateToken = (merchentId,res) =>{
    try{
        const token = jwt.sign({merchentId:merchentId,},process.env.JWT_SECRET,{expiresIn: '1hr'})
        res.cookie('jwt',token,{
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
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== 'development',
        })
    }catch(err){
        console.error(`Error generating agent token: ${err.message}`);
        throw new Error('Token generation failed'); // Pass the error to the main controller
    }
}


