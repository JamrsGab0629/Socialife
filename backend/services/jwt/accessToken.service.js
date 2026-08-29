import jwt from "jsonwebtoken";
import crypto from "crypto";
import "dotenv/config";

const generateAccessToken = (payload) => {
    const jti = crypto.randomUUID();
    const data = typeof payload === "object" ? { ...payload, jti } : { userId: payload, jti };

    return jwt.sign(
        data,
        process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );
};

const verifyAccessToken = (token) => {
    return jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET
    );
};

export {
    generateAccessToken,
    verifyAccessToken
};
