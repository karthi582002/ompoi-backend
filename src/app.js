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

dotenv.config();
const app = express();

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per minute
    message: "Too many requests, please try again later.",
});
app.use(limiter);
app.use(cors({
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true // Allow cookies if needed
}));
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
    res.send("Welcome to the Karthi!");
})
export default app;
