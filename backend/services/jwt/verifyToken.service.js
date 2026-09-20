import jwt from "jsonwebtoken";
import "dotenv/config";

const verifyRefreshToken = (token) => {
    return jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET
    );
};

const verifyAccessToken = (token) => {
    return jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET
    )
}

export {
    verifyAccessToken,
    verifyRefreshToken
};