import jwt from "jsonwebtoken";
import crypto from "crypto";
import "dotenv/config";

const generateToken = (userId) => {
    const jti = crypto.randomUUID();

    return jwt.sign(
        { userId, jti },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

export {
    generateToken
};