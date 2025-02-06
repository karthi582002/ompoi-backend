import express from "express";
import {register, checkUser, emailPassCheck, forgetPassword} from "../controller/register.controller.js";
import {upload} from "../middleware/Cloudinary_Upload.js";

const router = express.Router();
router.post("/", upload.single("file"), register);
router.post("/checkuser", checkUser);
router.post("/status", emailPassCheck);
router.post("/forget-password", forgetPassword,)

export default router;
