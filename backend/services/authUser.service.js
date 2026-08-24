import User from "../model/user.model.js";

/**
 * Returns the current authorized user without exposing the password hash.
 */
export const findAuthorizedUserById = async (userId) => {
    const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] }
    });

    return user?.toJSON() ?? null;
};
