import * as settingsService from "../../services/settings.service.js";

export const changePassword = async (req, res) => {
    try {
        const userId = req.user?.userId ?? req.user?.user_id;

        if (!userId) {
            const error = new Error("Not authorized or user ID is missing");
            error.status = 403;
            throw error;
        }

        const result = await settingsService.changePassword(userId, req.body);

        return res.status(200).json(result);
    } catch (error) {
        const status = error.status || 500;

        return res.status(status).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};