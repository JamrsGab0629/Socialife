import User from "../model/user.model"

export class MentionService {
    static async mention(receipient_id, author_id, classifier) {
        const user = await User.findByPk(receipient_id, {
             attributes: ["first_name", "last_name", "username"] 
            });

        if(!user) {
            throw new Error("User not found");
        }

        return {
            user_id: receipient_id,
            author_id: author_id,
            type: "Mention",
            message: `${user?.first_name} ${user?.last_name} mentioned you on their ${classifier}`,
        }
    }

    static async commentMention(receipient_id, author_id){
        return await mention(receipient_id, author_id, "comment");
    }

    static async postMention(receipient_id, author_id){
        return await mention(receipient_id, author_id, "post");
    }
}
