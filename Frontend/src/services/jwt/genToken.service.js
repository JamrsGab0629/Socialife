import jwt from "jsonwebtoken";
import crypto from "crypto";
import "dotenv/config";

const generateToken = (userId,role) => {
    const jti = crypto.randomUUID();

    return jwt.sign(
        { userId, role,jti },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

export {
    generateToken
};