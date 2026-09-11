import { Post, LikeData } from "../model/association.model.js";
import { safeNotify } from "../utils/notify.util.js";

export const toggleLikeService = async (postId, userId) => {
    const t = await LikeData.sequelize.transaction();
    try {
        const post = await Post.findOne({ where: { post_id: postId, is_active: true }, transaction: t });
        if (!post) throw new Error("Post not found");

        const existingLike = await LikeData.findOne({ where: { post_id: postId, user_id: userId }, transaction: t });

        if (existingLike) {
            await existingLike.destroy({ transaction: t });
            await post.decrement("like_count", { by: 1, transaction: t });
            await t.commit();
            return { liked: false };
        } else {
            await LikeData.create({ post_id: postId, user_id: userId }, { transaction: t });
            await post.increment("like_count", { by: 1, transaction: t });
            await t.commit();

            safeNotify(post.user_id, userId, "like", "liked your post.");
            return { liked: true };
        }
    } catch (error) {
        await t.rollback();
        throw error;
    }
};