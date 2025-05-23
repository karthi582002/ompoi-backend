import express from "express";
import {
    register,
    checkUser,
    emailPassCheck,
    checkAgentDetails,
    checkGSTNumber
} from "../controller/register.controller.js";
import {upload} from "../middleware/Cloudinary_Upload.js";

const router = express.Router();
router.post("/", upload.single("file"), register);
router.post("/checkuser", checkUser);
router.post("/status", emailPassCheck);
router.get("/agent-details",checkAgentDetails)
router.post("/check-agent",checkAgentDetails)
router.post("/gst-verification", checkGSTNumber)

export default router;
