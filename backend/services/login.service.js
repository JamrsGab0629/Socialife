import User from "../model/user.model.js"; 
import { comparePassword } from "../utils/passwordHashing.utils.js";
import { generateToken } from "./jwt/genToken.service.js";
import { validateEmail, validatePassword } from "../utils/validators.utils.js";

export const loginService = async ({ email, password }) => {
    if (!validateEmail(email)) {
        throw new Error("Email must be a valid address ending with @gmail.com.");
    }
    if (!validatePassword(password)) {
        throw new Error("Password must be at least 8 characters long.");
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error("Invalid email or password.");
    }

    //  BLOCK UNVERIFIED USERS HERE
    if (!user.is_verified) {
        throw new Error("Please verify your account with the OTP sent to your email before logging in.");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password.");
    }

    console.log(user.role === "admin" ? "Welcome admin" : "Welcome user"); // to show the role

    const token = generateToken(user.user_id);

    const userData = user.toJSON();
    delete userData.password;

    return {
        user: userData,
        token
    };
};
