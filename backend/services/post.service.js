import { Post, User, PhotoData, LikeData, CommentData } from "../model/association.model.js";
import { hybridLoad } from "../utils/loaders/hybrid.loader.js";

export const createPostService = async (userId, body, file) => {
    const { caption, content } = body;
    
    const t = await Post.sequelize.transaction();

    try {
        // 1. Create the post record
        const newPost = await Post.create({
            user_id: userId,
            caption,
            content,
            like_count: 0,
            comment_count: 0,
            is_active: true
        }, { transaction: t });

        let savedPhoto = null;

        // 2. If an image file is attached via multer-storage-cloudinary, save its metadata
        if (file) {
            savedPhoto = await PhotoData.create({
                user_id: userId,
                post_id: newPost.post_id,
                href: file.path // Cloudinary secure URL
            }, { transaction: t });
        }

        await t.commit();
        return { post: newPost, photo: savedPhoto };

    } catch (error) {
        await t.rollback();
        throw error;
    }
};

// for home page random posts
export const getHomeFeedService = async (query) => {
    const { page, limit } = query;

    return await hybridLoad(Post, {
        page,
        limit,
        where: { is_active: true }, // Filter out soft-deleted posts
        include: [
            { model: User, as: "author", attributes: ["user_id", "username", "profile_url"] },
            { model: PhotoData, as: "photo" },
        ],
        order: [["created_at", "DESC"]]
    });
};

// Fetch Profile Feed posts for a specific user using the hybrid loader helper.
export const getProfileFeedService = async (targetUserId, query) => {
    const { page, limit } = query;

    return await hybridLoad(Post, {
        page,
        limit,
        where: { user_id: targetUserId, is_active: true }, // Filter by user and active state
        include: [
            { model: User, as: "author", attributes: ["user_id", "username", "profile_url"] },
            { model: PhotoData, as: "photo" }
        ],
        order: [["created_at", "DESC"]]
    });
};

/**
 * Soft delete a post by flipping is_active to false.
 */
export const deactivatePostService = async (postId, userId) => {
    const post = await Post.findOne({
        where: { post_id: postId, user_id: userId }
    });

    if (!post) {
        throw new Error("Post not found or unauthorized");
    }

    post.is_active = false;
    await post.save();

    return post;
};

/**
 * Toggle like/unlike on a post and update like_count atomically.
 */
export const toggleLikeService = async (postId, userId) => {
    const t = await LikeData.sequelize.transaction();

    try {
        const post = await Post.findOne({
            where: { post_id: postId, is_active: true },
            transaction: t
        });

        if (!post) {
            throw new Error("Post not found");
        }

        const existingLike = await LikeData.findOne({
            where: { post_id: postId, user_id: userId },
            transaction: t
        });

        if (existingLike) {
            // Remove like and decrement count
            await existingLike.destroy({ transaction: t });
            await post.decrement("like_count", { by: 1, transaction: t });
            await t.commit();

            return { liked: false };
        } else {
            // Add like and increment count
            await LikeData.create({
                post_id: postId,
                user_id: userId
            }, { transaction: t });

            await post.increment("like_count", { by: 1, transaction: t });
            await t.commit();

            return { liked: true };
        }
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

/**
 * Add a comment to a post and update comment_count atomically.
 */
export const addCommentService = async (postId, userId, comment) => {
    const t = await CommentData.sequelize.transaction();

    try {
        const post = await Post.findOne({
            where: { post_id: postId, is_active: true },
            transaction: t
        });

        if (!post) {
            throw new Error("Post not found");
        }

        const newComment = await CommentData.create({
            post_id: postId,
            author_id: userId,
            comment
        }, { transaction: t });

        await post.increment("comment_count", { by: 1, transaction: t });
        await t.commit();

        return newComment;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

/**
 * Fetch comments for a post using hybrid loader.
 */
export const getCommentsService = async (postId, query) => {
    const { page, limit } = query;

    return await hybridLoad(CommentData, {
        page,
        limit,
        where: { post_id: postId },
        include: [
            { model: User, as: "author", attributes: ["user_id", "username", "profile_url"] }
        ],
        order: [["created_at", "DESC"]]
    });
};