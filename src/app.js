import express from "express";
import dotenv from "dotenv";
import registerRoute from "./routes/register.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import agent_registrationRoute from "./routes/routers.agent/agent_registration.route.js";
import otpRoute from "./routes/otp.route.js";
import paymentRoute from "./routes/payment.route.js";
import merchantRoute from "./routes/merchant.route.js";
import cloudinary from 'cloudinary';
import adminRoute from "./routes/auth.routes/admin.route.js";
import authRoute from "./routes/auth.route.js";
import buyerRoute from "./routes/buyer.routes/buyer.route.js";
// import rateLimit from "express-rate-limit"

dotenv.config();
const app = express();

// const limiter = rateLimit({
//     windowMs: 1 * 60 * 1000, // 1 minute
//     max: 10, // Limit each IP to 10 requests per minute
//     message: "Too many requests, please try again later.",
// });
// app.use(limiter);
const allowedOrigins = [
    // "http://localhost:5173", // Development Frontend
    // "https://yourfrontend.com" // Production Frontend
];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    if (!allowedOrigins.includes(origin)) {
        return res.status(403).json({ message: "Access Denied: Unauthorized Origin" });
    }
    
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    
    next();
});

app.use((req, res, next) => {
    const userAgent = req.headers["user-agent"] || "";
    
    // Block Postman and Curl requests
    if (userAgent.includes("Postman") || userAgent.includes("curl") || userAgent.includes("HTTPie")) {
        return res.status(403).json({ message: "Access Denied: Unauthorized Client" });
    }
    
    next();
});

app.use((req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    
    if (apiKey !== process.env.API_SECRET_KEY) {
        return res.status(403).json({ message: "Access Denied: Invalid API Key" });
    }

    next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})
// routes
app.use("/register", registerRoute);
app.use("/agent",agent_registrationRoute)
app.use("/otp",otpRoute)
app.use("/payment",paymentRoute)
app.use("/merchant",merchantRoute)
app.use("/admin",adminRoute)
app.use("/auth",authRoute)
app.use("/buyer",buyerRoute)



app.get("/", (req, res) => {
    res.send("Welcome to OMPOI Backend Inum SQL Host panla yena company kitta kasu illa 😊😌");
})
export default app;
