import { verifyAccessToken } from "../services/jwt/verifyToken.service.js";
import { findAuthorizedUserById } from "../services/authUser.service.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.access_token;

        if (!token) {
            return res.status(401).json({ message: 'Access token missing' });
        }

        // Purely in-memory cryptographic verification (No DB lookup)
        const decoded = verifyAccessToken(token);
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

// Checks if the logged-in user is an admin
export const isAdmin = async (req, res, next) => {
    try {
        const user = await findAuthorizedUserById(req.user?.user_id ?? req.user?.userId);

        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Unable to verify administrator access." });
    }
};
