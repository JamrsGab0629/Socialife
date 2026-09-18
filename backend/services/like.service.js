// services/like.service.js

import {
    Post,
    LikeData,
} from "../model/association.model.js";

import { safeNotify } from "../utils/notify.utils.js";

export const toggleLikeService = async (postId, userId) => {
    const transaction =
        await LikeData.sequelize.transaction();

    try {
        const post = await Post.findOne({
            where: {
                post_id: postId,
                is_active: true,
            },
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        if (!post) {
            const error = new Error("Post not found");
            error.statusCode = 404;
            throw error;
        }

        const existingLike = await LikeData.findOne({
            where: {
                post_id: postId,
                user_id: userId,
            },
            transaction,
        });

        if (existingLike) {
            await existingLike.destroy({
                transaction,
            });

            await post.decrement("like_count", {
                by: 1,
                transaction,
            });

            await post.reload({
                transaction,
            });

            await transaction.commit();

            return {
                liked: false,
                likeCount: Math.max(post.like_count, 0),
            };
        }

        await LikeData.create(
            {
                post_id: postId,
                user_id: userId,
            },
            {
                transaction,
            }
        );

        await post.increment("like_count", {
            by: 1,
            transaction,
        });

        await post.reload({
            transaction,
        });

        await transaction.commit();

        safeNotify(
            post.user_id,
            userId,
            "like",
            "liked your post."
        );

        return {
            liked: true,
            likeCount: post.like_count,
        };
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        throw error;
    }
};