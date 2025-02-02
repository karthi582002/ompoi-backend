import {checkVerifiedStatus, createUser, getUserByEmail, registerMerchant} from "../model/register.model.js";
// import generateToken from "../utils/generateToken..js";
import bcrypt from "bcrypt";


// checks the user when register with unique email
export const checkUser = async(req,res) => {
    try {
        const {email} = req.body;
        console.log(email);
        if (!email) {
            return res.status(400).json({
                error: "Email is required",
            })
        }
        const user = await getUserByEmail(email);
        console.log(user);
        if (user?.length === 0) {
            return res.status(200).json({
                success: true,
                error: "User not exists",
            })
        }
        res.status(409).json({
            message: "User already exists",
        })

    }catch(err) {
        console.error(err);
        res.status(500).json({
            error: "Error fetching user",
        })
    }
}

export const emailPassCheck = async (req, res) => {
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            error: "Email is required",
        })
    }
    const user = await getUserByEmail(email);
    if (user.length === 0){
        return res.status(404).json({
            error: "User Not Found",
        })
    }
    console.log(user[0].password);
    const isPasswordValid =await bcrypt.compare(password,user[0].password || " ");
    if(!isPasswordValid){
        return res.status(400).json({
            error: "Password is Incorrect",
        })
    }
    const status = await checkVerifiedStatus(email);
    const result = status[0].isVerified;

    res.status(200).json({message: 'User verified',result});
}

export const register = async (req, res ) => {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    try {
        const data = req.body;
        data.password = hashedPassword;
        const userExist = await getUserByEmail(data.email);``
        if (userExist.length !== 0) {
            return res.status(400).json({
                message: 'User already exists',
            })
        }
        const result = await registerMerchant(req.body);
        console.log(result);
        res.status(201).json({
            message: 'Register Successful',
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error adding user" });
    }
};
