import User from "../model/user.model.js";
import Otp from "../model/otp.model.js";
import { generateToken } from "./jwt/genToken.service.js";
import { setAuthCookie } from "../utils/cookie.utils.js";
import { generateOTP } from "../utils/gmail_utils/otpGen.utils.js";
import { getOTPExpiration } from "../utils/gmail_utils/otpExpired.utils.js";
import { sendVerificationEmail } from "./gmail/email.service.js";

const verifyOtpService = async (email, otp_code, res) => {
    // 1. Find the user first
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error("User not found.");
    }

    if (user.is_verified) {
        throw new Error("Account is already verified. Please log in.");
    }

    // 2. Find the corresponding OTP record in the 'otps' table using user_id
    const otpRecord = await Otp.findOne({ where: { user_id: user.user_id } });
    if (!otpRecord) {
        throw new Error("No OTP request found for this user. Please request a new one.");
    }

    // 3. Check if the OTP code matches
    if (otpRecord.otp_code !== otp_code) {
        throw new Error("Invalid OTP code.");
    }

    // 4. Check if the OTP has expired
    if (new Date() > new Date(otpRecord.otp_expires_at)) {
        await otpRecord.destroy();
        throw new Error("OTP has expired. Please request a new one.");
    }

    // 5. Flip user status to verified
    user.is_verified = true;
    await user.save();

    // 6. Delete the OTP record so it cannot be reused
    await otpRecord.destroy();

    // 7. Automatically log them in with your access token cookie
    const authToken = generateToken(user.user_id, user.role);
    setAuthCookie(res, authToken);

    const userData = user.toJSON();
    delete userData.password;

    return userData;
};

const resendOtpService = async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error("User not found.");
    }

    if (user.is_verified) {
        throw new Error("Account is already verified. Please log in.");
    }

    const otpCode = generateOTP();
    const otpExpiresAt = getOTPExpiration(15);

    // Upsert the OTP record
    const [otpRecord, created] = await Otp.findOrCreate({
        where: { user_id: user.user_id },
        defaults: {
            otp_code: otpCode,
            otp_expires_at: otpExpiresAt
        }
    });

    if (!created) {
        otpRecord.otp_code = otpCode;
        otpRecord.otp_expires_at = otpExpiresAt;
        await otpRecord.save();
    }

    await sendVerificationEmail(email, otpCode);

    return { message: "A new 6-digit OTP code has been sent to your email." };
};

export { verifyOtpService, resendOtpService };