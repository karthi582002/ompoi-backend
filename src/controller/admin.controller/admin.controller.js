import {addAdmin} from "../../model/admin.model/admin.model.js";
import bcrypt from "bcrypt";

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