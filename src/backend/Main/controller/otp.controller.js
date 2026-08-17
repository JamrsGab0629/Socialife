import User from "../model/user.model.js";
import Otp from "../model/otp.model.js";
import { generateOTP } from "../utils/gmail_utils/otpGen.utils.js";
import { getOTPExpiration } from "../utils/gmail_utils/otpExpired.utils.js";
import { sendVerificationEmail } from "../services/gmail/email.service.js";

//  Verify the OTP code
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP code are required" });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otpRecord = await Otp.findOne({ where: { user_id: user.user_id } });
        if (!otpRecord) {
            return res.status(400).json({ message: "No active OTP found. Please request a new one." });
        }

        if (otpRecord.otp_code !== otp) {
            return res.status(400).json({ message: "Invalid OTP code" });
        }

        if (new Date() > new Date(otpRecord.otp_expires_at)) {
            return res.status(400).json({ message: "OTP code has expired. Please request a new one." });
        }

        //  Destroy the OTP record so it cannot be reused
        await otpRecord.destroy();

        return res.status(200).json({
            message: "Email verified successfully!"
        });

    } catch (error) {
        console.error("VERIFY OTP ERROR:", error);
        return res.status(500).json({ message: "Server error during verification" });
    }
};

//  Resend a new OTP
export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate new code and expiration
        const newOtpCode = generateOTP();
        const newExpiresAt = getOTPExpiration(5);

        // Find existing OTP record or create one if it was deleted
        let otpRecord = await Otp.findOne({ where: { user_id: user.user_id } });

        if (otpRecord) {
            await otpRecord.update({
                otp_code: newOtpCode,
                otp_expires_at: newExpiresAt
            });
        } else {
            await Otp.create({
                user_id: user.user_id,
                otp_code: newOtpCode,
                otp_expires_at: newExpiresAt
            });
        }

        // Send the new email
        await sendVerificationEmail(email, newOtpCode);

        return res.status(200).json({
            message: "A new OTP code has been sent to your email."
        });

    } catch (error) {
        console.error("RESEND OTP ERROR:", error);
        return res.status(500).json({ message: "Server error while resending OTP" });
    }
};