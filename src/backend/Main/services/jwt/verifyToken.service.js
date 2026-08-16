import jwt from "jsonwebtoken";
import "dotenv/config";

const verifyToken = (token) => {
    return jwt.verify(
        token,
        process.env.JWT_SECRET
    );
};

export {
    verifyToken
};