import { Router } from "express";
import { verifyOtp, resendOtp } from "../controller/otp.controller.js";

const router = Router();

router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

export default router;