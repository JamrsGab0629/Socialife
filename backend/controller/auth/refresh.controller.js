import { generateAccessToken } from "../../services/jwt/genToken.service.js";
import { verifyRefreshToken } from "../../services/jwt/verifyToken.service.js";
import { setAccessTokenCookie } from "../../utils/cookie.utils.js";

export const refresh = async (req, res) => {
    try {
        // console.log("Cookie header arriving at server:", req.headers.cookie);
        const refreshToken = req.cookies?.refresh_token;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token missing' });
        }

        // Validate the refresh token cryptographically
        const { userId, role } = verifyRefreshToken(refreshToken);

        // Issue new short-lived Access Token
        const newAccessToken = generateAccessToken(userId, role)

        setAccessTokenCookie(res, newAccessToken);

        return res.json({ message: 'Access token renewed successfully' });
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
}