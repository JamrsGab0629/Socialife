import User from "../model/user.model.js";
import { otpCache } from "../utils/memoryCached.utils.js"; 

const verifyOtpService = async ({ email, otp }) => {
    // 1. Get the user from memory cache
    const pendingUser = otpCache.get(email);

    if (!pendingUser) {
        throw new Error("No pending registration found or session expired.");
    }

    // 2. Check expiration time
    if (Date.now() > pendingUser.expiresAt) {
        otpCache.delete(email);
        throw new Error("OTP has expired. Please register again.");
    }

    // 3. Validate OTP
    if (pendingUser.otp !== otp) {
        throw new Error("Invalid OTP code.");
    }

    // 4. Success! Save to PostgreSQL database now
    const newUser = await User.create({
        username: pendingUser.username,
        email: pendingUser.email,
        password: pendingUser.password, // Already hashed
        first_name: pendingUser.first_name,
        middle_name: pendingUser.middle_name,
        last_name: pendingUser.last_name,
        birth_date: pendingUser.birth_date,
        role: pendingUser.role,
        auth: pendingUser.auth,
        is_verified: true
    });

    //  Delete from memory cache so it can't be reused
    otpCache.delete(email);

    // Return the newly created user object so the controller can generate the token/cookie
    const userData = newUser.toJSON();
    delete userData.password;

    return userData;
};

export { verifyOtpService };