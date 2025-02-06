import {db} from "../config/db.js";
import {approved_merchant} from "../db/schema.js";
import {eq} from "drizzle-orm";

export const getMerchantID = async (email) => {
    return db.select({merchantId:approved_merchant.merchantId})
        .from(approved_merchant)
        .where(eq(approved_merchant.merchantEmail,email));
}