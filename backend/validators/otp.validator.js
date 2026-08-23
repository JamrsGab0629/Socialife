import { z } from "zod";

export const verifyOtpSchema = z.object({
    email: z.string().email("Invalid email address").endsWith("@gmail.com", "Email must end with @gmail.com"),
    otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must contain only numbers")
});