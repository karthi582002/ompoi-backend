import {master_admin} from "../../db/schema.js";
import {db} from "../../config/db.js";
import {eq} from "drizzle-orm";

export const addAdmin = async (adminEmail,adminPassword) => {
    return db.insert(master_admin).values({
        adminEmail:adminEmail,
        adminPassword:adminPassword
    });
}

export const getAdminByEmail = async (email) => {
    return db.select()
        .from(master_admin)
        .where(eq(master_admin.adminEmail,email))
}