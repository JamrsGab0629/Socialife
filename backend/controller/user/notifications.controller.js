import * as notificationService from "../../services/notifications.service.js";

export const getNotifications = async (req, res, next) => {
    try {
        const userId = req.user?.userId || req.user?.user_id;
        const query = req.validated.query;

        const result = await notificationService.getNotificationsService(userId, query);

        return res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
            ...result
        });
    } catch (error) {
        next(error); 
    }
};

export const markAsRead = async (req, res, next) => {
    try {
        const userId = req.user?.userId || req.user?.user_id;
        const { notificationId } = req.validated.params; 

        const result = await notificationService.markAsReadService(notificationId, userId);

        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: result
        });
    } catch (error) {
        next(error); 
    }
};