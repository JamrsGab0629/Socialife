import { NotificationService } from "../services/notifications.service.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user?.userId || req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const result = await NotificationService.getNotificationsService(userId, req.query);
        return res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
            ...result
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const userId = req.user?.userId || req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const result = await NotificationService.markAsReadService(req.params.notificationId, userId);
        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: result
        });
    } catch (error) {
        console.error("Error marking notification:", error);
        return res.status(400).json({ success: false, message: error.message || "Internal server error" });
    }
};