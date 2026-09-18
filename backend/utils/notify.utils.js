import * as notificationService from "../services/notifications.service.js";

export const safeNotify = (userId, authorId, type, content) => {
    if (userId !== authorId) {
        notificationService.createNotificationService({ userId, authorId, type, content })
            .catch(err => console.error("Notification error:", err.message));
    }
};