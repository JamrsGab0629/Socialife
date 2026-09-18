import { Notification, User } from "../model/association.model.js";
import { hybridLoad } from "../utils/loaders/hybrid.loader.js";

const createNotFoundError = (message) => {
    const error = new Error(message);
    error.statusCode = 404;
    return error;
};

export const createNotificationService = async (data) => {
    return await Notification.create({
        user_id: data.userId,
        author_id: data.authorId,
        type: data.type,
        content: data.content,
        is_read: false
    });
};

export const getNotificationsService = async (userId, query) => {
    return await hybridLoad(Notification, {
        page: query.page,
        limit: query.limit,
        where: { user_id: userId },
        include: [
            { model: User, as: "author", attributes: ["user_id", "username", "profile_url"] }
        ],
        order: [["created_at", "DESC"]]
    });
};

export const markAsReadService = async (notificationId, userId) => {
    const notification = await Notification.findOne({
        where: { notification_id: notificationId, user_id: userId }
    });

    if (!notification) {
        throw createNotFoundError("Notification not found");
    }

    notification.is_read = true;
    await notification.save();
    return notification;
};