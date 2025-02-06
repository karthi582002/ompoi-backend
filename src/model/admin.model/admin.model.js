import {master_admin} from "../../db/schema.js";
import {db} from "../../config/db.js";

export const addAdmin = async (adminEmail,adminPassword) => {
    return db.insert(master_admin).values({
        adminEmail:adminEmail,
        adminPassword:adminPassword
    });
}