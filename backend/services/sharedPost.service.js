import { SharedPost, Post, User } from "../model/association.model.js";
import { safeNotify } from "../utils/notify.utils.js"; 

// Custom error helper with status code
const createNotFoundError = (message) => {
    const error = new Error(message);
    error.statusCode = 404;
    return error;
};

export const createShareRecord = async (userId, postId, caption) => {
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

  safeNotify(post.user_id, userId, "share", "shared your post.", postId);

    return share;
};

export const getPostShares = async (postId) => {
    return await SharedPost.findAll({
        where: { post_id: postId },
        include: [{ model: User, as: "user", attributes: ["user_id", "username", "profile_url"] }],
    });
};