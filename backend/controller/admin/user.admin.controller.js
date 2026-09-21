import * as userServices from "../../services/user.admin.services.js";

/**
 * GET /api/admin/user/get/:status?
 */
export const getUsers = async (req, res) => {
    try {
        const status = req.params?.status ?? "ALL";

        // Pass req.query for pagination (page, limit)
        const result = await userServices.getUsers(status, req.query);

        return res.status(200).json({
            success: true,
            message: "Fetched successfully",
            result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch users",
        });
    }
};

/**
 * GET /api/admin/user/find/:username
 */
export const getByUsername = async (req, res) => {
    try {
        const username = req.params.username;

        const result = await userServices.getByUsername(username);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            result,
        });
    } catch (error) {
        if (error.status === 404 || error.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to find user by username",
        });
    }
};

/**
 * GET /api/admin/user/view/:userId
 */
export const viewUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        const result = await userServices.viewUser(userId);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            result,
        });
    } catch (error) {
        if (error.status === 404 || error.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to view user",
        });
    }
};

/**
 * PUT /api/admin/user/:userId/block
 */
export const toggleBlock = async (req, res) => {
    try {
        const userId = req.params.userId;

        const result = await userServices.toggleBlock(userId);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User block status updated successfully",
            result,
        });
    } catch (error) {
        if (error.status === 404 || error.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update block status",
        });
    }
};

export const suspension = async (req, res) => {
    try {
        const userId = req.params.userId;

        const result = await userServices.toggleBlock(userId);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User block status updated successfully",
            result,
        });
    } catch (error) {
        if (error.status === 404 || error.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (error.status === 403 || error.message === "USER_ALREADY_BANNED_OR_SUSPENDED") {
            return res.status(404).json({
                success: false,
                message: "User already banned or suspended",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update block status",
        });
    }
}