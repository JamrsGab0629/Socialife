import { verifyOtpService, resendOtpService } from "../services/verifyOtp.service.js";
import { verifyOtpSchema } from "../validators/otp.validator.js";
import { z } from "zod";

export const verifyOtp = async (req, res) => {
    try {
        // 1. Validate req.body using Zod
        const validatedData = verifyOtpSchema.parse(req.body);

        // 2. Pass to service
        const user = await verifyOtpService(validatedData.email, validatedData.otp, res);

        return res.status(200).json({
            message: "OTP verified successfully! You are now logged in.",
            user: {
                username: user.username,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name
            }
        });

    } catch (error) {
        if (error.name === "ZodError") {
            const errorMessages = error.errors.map(err => err.message).join(", ");
            return res.status(400).json({ message: errorMessages });
        }

        return res.status(400).json({ message: error.message || "Server error during OTP verification" });
    }
};

export const resendOtp = async (req, res) => {
    try {
        const emailSchema = z.object({
            email: z.string().email("Invalid email address")
        });

        const { email } = emailSchema.parse(req.body);
        const result = await resendOtpService(email);

        return res.status(200).json({ message: result.message });

    } catch (error) {
        if (error.name === "ZodError") {
            const errorMessages = error.errors.map(err => err.message).join(", ");
            return res.status(400).json({ message: errorMessages });
        }

        return res.status(400).json({ message: error.message || "Server error while resending OTP" });
    }
};