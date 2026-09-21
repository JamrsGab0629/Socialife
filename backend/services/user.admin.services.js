import User from "../model/user.model.js";

/**
 * Get all users with status filter and pagination
 * @param {string} status - Filter by status (e.g., "PENDING", "REVIEWED", "ALL")
 * @param {object} query - Query parameters containing page and limit
 */
export const getUsers = async (status, query = {}) => {
    const page = parseInt(query.page || "1", 10);
    const limit = parseInt(query.limit || "10", 10);
    const offset = (page - 1) * limit;

    // Build filter condition
    const whereCondition = {};
    if (status && status.toUpperCase() !== "ALL") {
        whereCondition.is_actived = (status === "ACTIVE") ? true : false ;
    }

    const { count, rows: users } = await User.findAndCountAll({
        where: whereCondition,
        attributes: { exclude: ["password"] },
        limit,
        offset,
        order: [["created_at", "DESC"]],
    });

    return {
        users,
        pagination: {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            limit,
        },
    };
};

/**
 * Get full profile details for a specific user
 * @param {string} userId
 */
export const viewUser = async (userId) => {
    const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
    });

    if (!user) {
        const error = new Error("USER_NOT_FOUND");
        error.status = 404;
        throw error;
    }

    return user;
};

/**
 * Find a unique user by exact username
 * @param {string} username
 */
export const getByUsername = async (username) => {
  const user = await User.findOne({
    where: { username },
    attributes: { exclude: ["password"] },
  });

  return user; // Returns null if user is not found
};

/**
 * Toggle the isBlocked / status field for a user
 * @param {string} userId
 */
export const toggleBlock = async (userId) => {
    const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
    });

    if (!user) {
        const error = new Error("USER_NOT_FOUND");
        error.status = 404;
        throw error;
    }

    // Toggle boolean status (adjust property name if using status string like "BLOCKED")
    const newBlockStatus = !user.is_actived;
    await user.update({ is_actived: newBlockStatus });

    return user;
};

export const suspension = async (userId) => {
        const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
    });

    if (!user) {
        const error = new Error("USER_NOT_FOUND");
        error.status = 404;
        throw error;
    }

    if (!user.is_actived) {
        const error = new Error("USER_ALREADY_BANNED_OR_SUSPENDED")
        error.status = 403;
        throw error;
    }

    // Toggle boolean status (adjust property name if using status string like "BLOCKED")
    await user.update({ is_actived: false });

    return user;
}