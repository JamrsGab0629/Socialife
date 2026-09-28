import User from "../model/user.model.js";

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
}