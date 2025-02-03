import express from "express";
import dotenv from "dotenv";
import registerRoute from "./routes/register.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import agent_registrationRoute from "./routes/routers.agent/agent_registration.route.js";
import otpRoute from "./routes/otp.route.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/register", registerRoute);
app.use("/agent",agent_registrationRoute)
app.use("/otp",otpRoute)
app.get("/", (req, res) => {
    res.send("Welcome to the Karthi!");
})

export default app;
