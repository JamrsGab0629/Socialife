import { verifyToken } from "../services/jwt/verifyToken.service.js";
import TokenBlocklist from "../model/tokenBlocklist.model.js";
import { findAuthorizedUserById } from "../services/authUser.service.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "No token provided. Please log in." });
        }

        // Verify and decode token
        const decoded = verifyToken(token);

        // Check if the jti is blocklisted 
        const isBlocked = await TokenBlocklist.findOne({ where: { jti: decoded.jti } });
        if (isBlocked) {
            return res.status(401).json({ message: "Token has been revoked. Please log in again." });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

// Checks if the logged-in user is an admin
export const isAdmin = async (req, res, next) => {
    try {
        const user = await findAuthorizedUserById(req.user?.userId);

        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Unable to verify administrator access." });
    }
};
