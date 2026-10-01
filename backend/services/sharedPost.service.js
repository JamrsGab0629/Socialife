import { SharedPost, Post, User, PhotoData } from "../model/association.model.js";
import { safeNotify } from "../utils/notify.utils.js";
import { MentionService } from "./mention.service.js";

// Custom error helper with status code
const createNotFoundError = (message) => {
    const error = new Error(message);
    error.statusCode = 404;
    return error;
};

export const createShareRecord = async (userId, postId, caption, mentions = []) => {
    const post = await Post.findOne({
        where: { post_id: postId, is_active: true }
    });

    if (!post) {
        throw createNotFoundError("Post not found or has been deactivated");
    }

    const share = await SharedPost.create({
        user_id: userId,
        post_id: postId,
        caption: caption || null,
    });

    safeNotify(post.user_id, userId, "share", "shared your post.", postId, share.share_id);

    MentionService.notifyMentions({
        mentionedIds: mentions,
        authorId: userId,
        type: "share",
        postId,
        excludeUserIds: [post.user_id], // already notified about the share itself
    }).catch((err) => console.error("Mention notify error:", err.message));

    return share;
};

export const getShareById = async (shareId) => {
    const share = await SharedPost.findByPk(shareId, {
        include: [
            { model: User, as: "user", attributes: ["user_id", "username", "profile_url"] },
            {
                model: Post,
                as: "post",
                include: [{ model: PhotoData, as: "photo" }],
            },
        ],
    });
    if (!share) throw createNotFoundError("Share not found");
    return share;
};