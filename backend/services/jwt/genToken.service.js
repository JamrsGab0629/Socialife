import jwt from "jsonwebtoken";
import crypto from "crypto";
import "dotenv/config";

const generateRefreshToken = (userId, role) => {
    const jti = crypto.randomUUID();

    return jwt.sign(
        { userId, role, jti, tokenType: "refresh" },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );
};

const generateAccessToken = (userId, role) => {
    const jti = crypto.randomUUID();

    return jwt.sign(
        { userId, role, jti, tokenType: "access" },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
    );
};

export {
    generateAccessToken,
    generateRefreshToken,
};