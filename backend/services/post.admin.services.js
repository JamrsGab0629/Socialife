import { User, Post, PhotoData } from "../model/association.model.js";


/**
 * Get posts filtered by status with pagination
 */
export const getPosts = async (status, query = {}) => {
    const page = parseInt(query.page || "1", 10);
    const limit = parseInt(query.limit || "10", 10);
    const offset = (page - 1) * limit;

    const whereCondition = {};
    if (status && status.toUpperCase() !== "ALL") {
        whereCondition.is_active = (status === "ACTIVE") ? true : false; // Updated to match removePost schema
    }

    const { count, rows: posts } = await Post.findAndCountAll({
        where: whereCondition,
        include: [{ model: User, as: "author", attributes: ["user_id", "username", "profile_url"] }],
        limit,
        offset,
        order: [["created_at", "DESC"]],
    });

    return {
        posts,
        pagination: {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            limit,
        },
    };
};

/**
 * Get all posts created by a specific username
 */
export const getByUsername = async (username, query = {}) => {
    const page = parseInt(query.page || "1", 10);
    const limit = parseInt(query.limit || "10", 10);
    const offset = (page - 1) * limit;

    const { count, rows: posts } = await Post.findAndCountAll({
        include: [
            {
                model: User,
                as: "author",
                where: { username },
                attributes: ["user_id", "username", "profile_url"],
            },
        ],
        limit,
        offset,
        order: [["created_at", "DESC"]],
    });

    return {
        posts,
        pagination: {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            limit,
        },
    };
};

/**
 * View a single post by ID
 */


export const viewPost = async (postId) => {
    const post = await Post.findByPk(postId, {
        include: [
            { model: User, as: "author", attributes: ["user_id", "username", "profile_url"] },
            { model: PhotoData, as: "photo" },
        ],
    });

    if (!post) {
        const error = new Error("POST_NOT_FOUND");
        error.status = 404;
        throw error;
    }

    return post;
};

/**
 * Soft-delete or toggle status for a post
 */
export const removePost = async (postId) => {
    const post = await Post.findByPk(postId);

    if (!post) {
        const error = new Error("POST_NOT_FOUND");
        error.status = 404;
        throw error;
    }

    const newStatus = !post.is_active
    await post.update({ is_active: newStatus });

    return post;
};