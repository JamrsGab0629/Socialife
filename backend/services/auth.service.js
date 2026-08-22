import User from "../model/user.model.js";
import { hashPassword } from "../utils/passwordHashing.utils.js";
import { validateEmail, validatePassword } from "../utils/validators.utils.js";
import { generateOTP } from "../utils/gmail_utils/otpGen.utils.js";
import { sendVerificationEmail } from "./gmail/email.service.js";
import { otpCache } from "../utils/memoryCached.utils.js"; 

const registerUser = async ({ username, email, password, first_name, middle_name, last_name, birth_date }) => {
    // 1. Validations
    if (!validateEmail(email)) {
        throw new Error("Email must be a valid address ending with @gmail.com.");
    }
    if (!validatePassword(password)) {
        throw new Error("Password must be at least 8 characters long.");
    }
    
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
        throw new Error("Username already exists");
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
        throw new Error("Email already exists");
    }

    // 2. Hash password
    const hashedPassword = await hashPassword(password);

    // 3. Generate OTP and set expiration (5 minutes from now)
    const otpCode = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; 

    // 4. Create the pending user payload
    const pendingUser = {
        username,
        email,
        password: hashedPassword,
        first_name,
        middle_name: middle_name || null,
        last_name,
        birth_date,
        role: "user",
        auth: "local",
        otp: otpCode,
        expiresAt
    };

    // 5. Save directly to Node.js memory
    otpCache.set(email, pendingUser);

    // 6. Send the verification code to their email
    await sendVerificationEmail(email, otpCode);

    return {
        message: "Registration initiated. OTP sent to email."
    };
};

export { registerUser };