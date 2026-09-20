import User from "../model/user.model.js";

export class MentionService {
    static async mention(recipientId, authorId, classifier) {
        const user = await User.findByPk(recipientId, {
            attributes: [
                "first_name",
                "last_name",
                "username"
            ]
        });

        if (!user) {
            throw new Error("User not found");
        }

        return {
            userId: recipientId,
            authorId: authorId,
            type: "Mention",
            content: `${user.first_name} ${user.last_name} mentioned you on their ${classifier}`,
        };
    }

    static async commentMention(recipientId, authorId) {
        return MentionService.mention(
            recipientId,
            authorId,
            "comment"
        );
    }

    static async postMention(recipientId, authorId) {
        return MentionService.mention(
            recipientId,
            authorId,
            "post"
        );
    }
}