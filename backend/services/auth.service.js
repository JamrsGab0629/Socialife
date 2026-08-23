import User from "../model/user.model.js";
import Otp from "../model/otp.model.js";
import { hashPassword } from "../utils/passwordHashing.utils.js";
import { sendVerificationEmail } from "./gmail/email.service.js";
import { generateOTP } from "../utils/gmail_utils/otpGen.utils.js";
import { getOTPExpiration } from "../utils/gmail_utils/otpExpired.utils.js";

const registerUser = async ({ username, email, password, first_name, middle_name, last_name, birth_date }) => {
    // 1. Check if username or email already exists
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername && existingUsername.is_verified) {
        throw new Error("Username already exists");
    }

    const existingEmail = await User.findOne({ where: { email } });
    const hashedPassword = await hashPassword(password);

    // Use your utility functions here!
    const otpCode = generateOTP();
    const otpExpiresAt = getOTPExpiration(15); // Sets expiration to 15 minutes for testing its 15 but 5 after

    let targetUser;

    if (existingEmail) {
        if (!existingEmail.is_verified) {
            // Pending user collision handling: update their info
            existingEmail.username = username;
            existingEmail.password = hashedPassword;
            existingEmail.first_name = first_name;
            existingEmail.middle_name = middle_name || null;
            existingEmail.last_name = last_name;
            existingEmail.birth_date = birth_date;
            await existingEmail.save();

            targetUser = existingEmail;
        } else {
            throw new Error("Email already registered. Please log in.");
        }
    } else {
        // 2. Save brand new pending user to PostgreSQL with is_verified: false
        targetUser = await User.create({
            username,
            email,
            password: hashedPassword,
            first_name,
            middle_name: middle_name || null,
            last_name,
            birth_date,
            role: "user",
            auth: "local",
            is_verified: false
        });
    }

    // 3. Upsert the 6-digit OTP in your separate 'otps' table
    const [otpRecord, created] = await Otp.findOrCreate({
        where: { user_id: targetUser.user_id },
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

    // 4. Send the 6-digit OTP code via email
    await sendVerificationEmail(email, otpCode);

    return { message: "Registration initiated. Please check your email for the 6-digit OTP code." };
};

export { registerUser };