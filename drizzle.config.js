import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
    schema: "./src/db/schema.js", // Adjust this path if necessary
    out: "./drizzle",
    dialect: "mysql", // ✅ Use dialect instead of driver
    // dbCredentials: {
    //     connectionString: process.env.DATABASE_URL, // Ensure this is correctly set in .env
    // },
    dbCredentials: {
        host: "127.0.0.1",
        user: process.env.SQL_USERNAME,
        database: process.env.SQL_DATABASE,
        password: process.env.SQL_PASSWORD,
        port:'3306'
    }});
