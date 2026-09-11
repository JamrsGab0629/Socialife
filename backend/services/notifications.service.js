import { Notification, User } from "../model/association.model.js";
import { hybridLoad } from "../utils/loaders/hybrid.loader.js";

export class NotificationService {
    static async createNotification(data) {
        return await Notification.create({
            user_id: data.userId,
            author_id: data.authorId,
            type: data.type,
            content: data.content,
            is_read: false
        });
    }

    static async getNotificationsService(userId, query) {
        return await hybridLoad(Notification, {
            page: query.page,
            limit: query.limit,
            where: { user_id: userId },
            include: [
                { model: User, as: "author", attributes: ["user_id", "username", "profile_url"] }
            ],
            order: [["created_at", "DESC"]]
        });
    }

    static async markAsReadService(notificationId, userId) {
        const notification = await Notification.findOne({
            where: { notification_id: notificationId, user_id: userId }
        });

        if (!notification) {
            throw new Error("Wala ang notification");
        }

        notification.is_read = true;
        await notification.save();
        return notification;
    }
}