import * as teamService from "../../services/team.admin.service.js";

/**
 * Get team members filtered by role with pagination
 */
export const getTeamMembers = async (req, res, next) => {
    try {
        const { role } = req.params;
        const result = await teamService.getTeamMembers(role, req.query);

        res.status(200).json({
            success: true,
            data: result.members,
            pagination: result.pagination,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Add or promote a user to admin role
 */
export const addAdminMember = async (req, res, next) => {
    try {
        const { userId, role } = req.body;
        const member = await teamService.addAdminMember(userId, role);

        res.status(201).json({
            success: true,
            message: "ADMIN_MEMBER_ADDED_SUCCESSFULLY",
            data: member,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update role for a specific team member
 */
export const updateMemberRole = async (req, res, next) => {
    try {
        const { memberId } = req.params;
        const { role } = req.body;
        const member = await teamService.updateMemberRole(memberId, role);

        res.status(200).json({
            success: true,
            message: "MEMBER_ROLE_UPDATED_SUCCESSFULLY",
            data: member,
        });
    } catch (error) {
        next(error);
    }
};