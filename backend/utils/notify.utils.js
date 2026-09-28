import * as notificationService from "../services/notifications.service.js";

export const safeNotify = (userId, authorId, type, content, postId = null, shareId = null) => {
    if (userId !== authorId) {
        notificationService.createNotificationService({ userId, authorId, type, content, postId, shareId })
            .catch(err => console.error("Notification error:", err.message));
    }
};