import { Post, User, CommentData } from "../model/association.model.js";
import { hybridLoad } from "../utils/loaders/hybrid.loader.js";
import { safeNotify } from "../utils/notify.utils.js";

export const addCommentService = async (postId, userId, comment) => {
    const t = await CommentData.sequelize.transaction();
    try {
        const post = await Post.findOne({ where: { post_id: postId, is_active: true }, transaction: t });
        if (!post) throw new Error("Post not found");

        const newComment = await CommentData.create({ post_id: postId, author_id: userId, comment }, { transaction: t });
        await post.increment("comment_count", { by: 1, transaction: t });
        await t.commit();

        safeNotify(post.user_id, userId, "comment", "commented on your post.");
        return newComment;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

export const getCommentsService = async (postId, query) => {
    return await hybridLoad(CommentData, {
        page: query.page,
        limit: query.limit,
        where: { post_id: postId },
        include: [
            { model: User, as: "author", attributes: ["user_id", "username", "profile_url"] }
        ],
        order: [["created_at", "DESC"]]
    });
};