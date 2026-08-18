import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import TokenBlocklist from "../model/tokenBlocklist.model.js";

export async function revokeTokenService(token) {
    if (!token) return;

    const decoded = jwt.decode(token);
    
    if (decoded && decoded.jti && decoded.exp) {
        const userId = decoded.userId;

        // 1. Delete ALL old blocklist entries for this user so only the new one stays
        await TokenBlocklist.destroy({
            where: {
                user_id: userId,
                jti: { [Op.ne]: decoded.jti } // Keeps the current one, deletes the old ones
            }
        });

        // 2. Add the new logout token
        await TokenBlocklist.findOrCreate({
            where: { jti: decoded.jti },
            defaults: {
                user_id: userId,
                expiresAt: new Date(decoded.exp * 1000)
            }
        });
    }
}