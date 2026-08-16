import User from "../model/user.model.js";
import { verifyToken } from "../services/jwt/verifyToken.service.js"; 

export const authenticateUser = async (req, res, next) => {
    try {
        // Look for token in cookies or Authorization header
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Authentication required. No token provided." });
        }

        // Verify token 
        const decoded = verifyToken(token);

        // Find user in database to ensure they still exist
        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "User belonging to this token no longer exists." });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: "Access denied. You do not have permission to access this resource." 
            });
        }
        next();
    };
};