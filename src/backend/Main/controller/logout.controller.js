import jwt from "jsonwebtoken";
import TokenBlocklist from "../model/tokenBlocklist.model.js";

export const logout = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (token) {
            // Decode the token without full verification just to grab the jti and expiration
            const decoded = jwt.decode(token);
            
            if (decoded && decoded.jti) {
                // Save the jti to the blocklist database
                await TokenBlocklist.create({
                    jti: decoded.jti,
                    expiresAt: new Date(decoded.exp * 1000) // Convert JWT timestamp to JS Date
                });
            }
        }

        // Clear the HTTP-only cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        return res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Server error during logout." });
    }
};