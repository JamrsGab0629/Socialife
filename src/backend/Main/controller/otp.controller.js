import { verifyOtpService } from "../services/verifyOtp.service.js";
import { generateOTP } from "../utils/gmail_utils/otpGen.utils.js";
import { sendVerificationEmail } from "../services/gmail/email.service.js";
import { setAuthCookie } from "../utils/cookie.utils.js";
import { generateToken } from "../services/jwt/genToken.service.js"; 
import { otpCache } from "../utils/memoryCached.utils.js"; 

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP code are required" });
        }

     
        const newUser = await verifyOtpService({ email, otp });

        // Generate token and set cookie after successful verification
        const token = generateToken(newUser.user_id, newUser.role); 
        setAuthCookie(res, token);

        return res.status(201).json({
            message: "Account verified and created successfully!",
            user: {
                username: newUser.username,
                email: newUser.email,
                first_name: newUser.first_name,
                last_name: newUser.last_name
            }
        });

    } catch (error) {
        return res.status(400).json({ message: error.message || "Server error during verification" });
    }
};

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const pendingUser = otpCache.get(email);

        if (!pendingUser) {
            return res.status(400).json({ message: "Registration session expired. Please register again." });
        }

        const newOtpCode = generateOTP();
        pendingUser.otp = newOtpCode;
        pendingUser.expiresAt = Date.now() + 5 * 60 * 1000;
        otpCache.set(email, pendingUser);

        await sendVerificationEmail(email, newOtpCode);

        return res.status(200).json({
            message: "A new OTP code has been sent to your email."
        });

    } catch (error) {
        console.error("RESEND OTP ERROR:", error);
        return res.status(500).json({ message: "Server error while resending OTP" });
    }
};