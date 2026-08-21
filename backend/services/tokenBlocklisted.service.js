import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import TokenBlocklist from "../model/tokenBlocklist.model.js";

export async function revokeTokenService(token) {
    if (!token) {
        return { success: false, message: "No token provided." };
    }

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.jti || !decoded.exp) {
        return { success: false, message: "Invalid token structure." };
    }

    // Check if already blocklisted
    const existingBlock = await TokenBlocklist.findOne({ 
        where: { jti: decoded.jti } 
    });

    if (existingBlock) {
        return { success: false, message: "Already logged out." };
    }

    // Delete older tokens for this user so only the current one stays
    await TokenBlocklist.destroy({
        where: {
            user_id: decoded.userId,
            jti: { [Op.ne]: decoded.jti }
        }
    });

    // Add current token to blocklist
    await TokenBlocklist.create({
        jti: decoded.jti,
        user_id: decoded.userId,
        expiresAt: new Date(decoded.exp * 1000)
    });

    return { success: true, message: "Logged out successfully." };
}