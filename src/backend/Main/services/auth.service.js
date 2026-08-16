import User from "../model/user.model.js";
import { hashPassword } from "../utils/passwordHashing.utils.js";
import { generateToken } from "./jwt/genToken.service.js";
import { validateEmail, validatePassword } from "../utils/validators.utils.js";

const registerUser = async ({
    username,
    email,
    password,
    first_name,
    middle_name,
    last_name,
    birth_date
}) => {
    if (!validateEmail(email)) {
        throw new Error("Email must be a valid address ending with @gmail.com.");
    }

    // Validate password length 
    if (!validatePassword(password)) {
        throw new Error("Password must be at least 8 characters long.");
    }
    
    // Check username
    const existingUsername = await User.findOne({
        where: { username }
    });

    if (existingUsername) {
        throw new Error("Username already exists");
    }

    // Check email
    const existingEmail = await User.findOne({
        where: { email }
    });

    if (existingEmail) {
        throw new Error("Email already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        first_name,
        middle_name,
        last_name,
        birth_date,
        role: "user",
        auth: "local"
    });

    // Generate JWT 
    const token = generateToken(user.user_id, user.role);

    // Don't return password
    const userData = user.toJSON();
    delete userData.password;

    return {
        user: userData,
        token
    };
};

export {
    registerUser
};