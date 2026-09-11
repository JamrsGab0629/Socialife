import { NotificationService } from "../services/notifications.service.js";

export const safeNotify = (userId, authorId, type, content) => {
    if (userId !== authorId) {
        NotificationService.createNotification({ userId, authorId, type, content })
            .catch(err => console.error("Notification error:", err.message));
    }
};