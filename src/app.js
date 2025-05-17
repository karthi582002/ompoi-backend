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
import rateLimit from "express-rate-limit"
import swaggerUi from "swagger-ui-express"
import fs from 'fs';
import morgan from "morgan";
import logger from "./logger.js";


const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf-8'));
dotenv.config();
const app = express();
app.set('trust proxy', 1);
// Rate limiter for preventing DDos Attack
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20, // Limit each IP to 10 requests per minute
    message: "Too many requests, please try again later.",
});
app.use(limiter);

// will be adding our front-end url after Hosting
const allowedOrigins = [
     "http://localhost:5173", // Development Frontend
    "http://localhost:5173",
    "http://localhost:8081",
     // "https://yourfrontend.com" // Production Frontend

];

// Only Valid Users can connect with our backend
// app.use((req, res, next) => {
//     const origin = req.headers.origin;
//
//         if (!allowedOrigins.includes(origin)) {
//             return res.status(403).json({ message: "Access Denied: Unauthorized Origin" });
//         }
//
//     res.header("Access-Control-Allow-Origin", origin);
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization,x-api-key");
//     res.header("Access-Control-Allow-Credentials", "true");
//
//     if (req.method === "OPTIONS") {
//         return res.sendStatus(200);
//     }
//
//     next();
// });

// USE cors middleware
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Access Denied: Unauthorized Origin'));
        }
    },
    credentials: true, // Important for cookies
}));

// // Even we cannot test our backend with help of postman this was comment out when in production it will works
// app.use((req, res, next) => {
//     const userAgent = req.headers["user-agent"] || "";
//
//     // Block Postman and Curl requests
//     if (userAgent.includes("Postman") || userAgent.includes("curl") || userAgent.includes("HTTPie")) {
//         return res.status(403).json({ message: "Access Denied: Unauthorized Client" });
//     }
//
//     next();
// });

// Only With The secure API key only we can access our backend by the frontend
// app.use((req, res, next) => {
//     const apiKey = req.headers["x-api-key"];
//
//     if (apiKey !== process.env.API_SECRET_KEY) {
//         return res.status(403).json({ message: "Access Denied: Invalid API Key" });
//     }
//
//     next();
// });



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})
// Create a stream to send morgan logs to winston
const stream = {
    write: (message) => logger.info(message.trim()), // remove newline from morgan
};
const morganFormat = ':remote-addr :method :url :status :res[content-length] - :response-time ms';
// Apply morgan middleware
app.use(morgan(morganFormat, { stream }));


// routes
app.use("/register", registerRoute);
app.use("/agent",agent_registrationRoute)
app.use("/otp",otpRoute)
app.use("/payment",paymentRoute)
app.use("/merchant",merchantRoute)
app.use("/admin",adminRoute)
app.use("/auth",authRoute)
app.use("/buyer",buyerRoute)



// Swagger UI at /
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Keep a simple health check at /api/status
app.get("/api/status", (req, res) => {
    res.send("Welcome to the OMPOI - Backend Server is Working Fine!");
});


export default app;
