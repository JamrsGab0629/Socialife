import User from "../model/user.model.js";
import { Notification } from "../model/association.model.js";

export class MentionService {
    static async mention(recipientId, authorId, classifier, postId) {
        const recipient = await User.findByPk(recipientId, {
            attributes: ["user_id"]
        });

        if (!recipient) {
            throw new Error("User not found");
        }

        return {
            userId: recipientId,
            authorId,
            type: "mention",
            content: `mentioned you in a ${classifier}.`,
            postId,
        };
    }

    static commentMention(recipientId, authorId, postId) {
        return MentionService.mention(recipientId, authorId, "comment", postId);
    }

    static postMention(recipientId, authorId, postId) {
        return MentionService.mention(recipientId, authorId, "post", postId);
    }

    static async notifyMentions({ mentionedIds = [], authorId, type, postId, excludeUserIds = [] }) {
        const excluded = new Set([authorId, ...excludeUserIds].filter(Boolean).map(String));
        const ids = [...new Set(mentionedIds.map(String))].filter((id) => !excluded.has(id));
        if (ids.length === 0) return [];

        const users = await User.findAll({ where: { user_id: ids }, attributes: ["user_id"] });
        if (users.length === 0) return [];

        return Notification.bulkCreate(
            users.map((u) => ({
                user_id: u.user_id,
                author_id: authorId,
                type: "mention",
                content: `mentioned you in a ${type}.`,
                post_id: postId,
                is_read: false,
            }))
        );
    }
}