import {addAdmin, getAdminByEmail} from "../../model/admin.model/admin.model.js";
import bcrypt from "bcrypt";
import {generateAdminToken} from "../../utils/generateToken..js";

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