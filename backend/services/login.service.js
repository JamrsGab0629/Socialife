import User from "../model/user.model.js"; // Make sure this relative path matches where your user.model.js is located
import { comparePassword } from "../utils/passwordHashing.utils.js";
import { generateToken } from "./jwt/genToken.service.js";
import { validateEmail, validatePassword } from "../utils/validators.utils.js";

export const loginService = async ({ email, password }) => {
    // console.log("debig.loginService", email, password);

    if (!validateEmail(email)) {
        throw new Error("Email must be a valid address ending with @gmail.com.");
    }
    if (!validatePassword(password)) {
        throw new Error("Password must be at least 8 characters long.");
    }

    const user = await User.findOne({ where: { email } });
    const isPasswordValid = await comparePassword(password, user?.password ?? "_");
    if (!user || !isPasswordValid) {
        throw new Error("Invalid email or password.");
    }

    const token = generateToken(user.user_id, user.role);

    const userData = user.toJSON();
    delete userData.password;

    return {
        user: userData,
        token
    };
};