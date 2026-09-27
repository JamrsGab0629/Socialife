import { User } from "../../model/association.model.js";

/**
 * Get team members filtered by role with pagination
 */
export const getTeamMembers = async (role = "all", query = {}) => {
    const page = parseInt(query.page || "1", 10);
    const limit = parseInt(query.limit || "10", 10);
    const offset = (page - 1) * limit;

    const whereCondition = {};
    if (role && role !== "undefined" && role.toLowerCase() !== "all") {
        whereCondition.role = role.toLowerCase();
    } else {
        whereCondition.role = "admin";
    }

    const { count, rows: members } = await User.findAndCountAll({
        where: whereCondition,
        attributes: ["user_id", "username", "email", "role", "created_at", "profile_url"],
        distinct: true,
        col: "user_id",
        limit,
        offset,
        order: [["created_at", "DESC"]],
    });

    return {
        members,
        pagination: {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            limit,
        },
    };
};

/**
 * Add or promote a user to admin role
 */
export const addAdminMember = async (userId, role = "admin") => {
    if (!userId) {
        const error = new Error("MISSING_USER_ID");
        error.status = 400;
        throw error;
    }

    const user = await User.findByPk(userId);

    if (!user) {
        const error = new Error("USER_NOT_FOUND");
        error.status = 404;
        throw error;
    }

    await user.update({ role: role.toLowerCase() });

    return {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile_url: user.previousrofile_url
    };
};

/**
 * Update role for a specific team member
 */
export const updateMemberRole = async (memberId, role) => {
    const allowedRoles = ["user", "admin"];

    if (!role || !allowedRoles.includes(role.toLowerCase())) {
        const error = new Error("INVALID_ROLE");
        error.status = 400;
        throw error;
    }

    const member = await User.findByPk(memberId);

    if (!member) {
        const error = new Error("MEMBER_NOT_FOUND");
        error.status = 404;
        throw error;
    }

    await member.update({ role: role.toLowerCase() });

    return {
        user_id: member.user_id,
        username: member.username,
        email: member.email,
        role: member.role,
        profile_url: user.previousrofile_url
    };
};