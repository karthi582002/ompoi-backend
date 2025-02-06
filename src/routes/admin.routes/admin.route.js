import express from 'express';
import {registerAdmin} from "../../controller/admin.controller/admin.controller.js";
const router = express.Router()

router.post("/register",registerAdmin)
;
export default router;