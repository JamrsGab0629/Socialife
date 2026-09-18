import SavedPost from "../model/savedPost.model.js";
import Post from "../model/post.model.js";
import PhotoData from "../model/photo_data.model.js";
import { hybridLoad } from "../utils/loaders/hybrid.loader.js";


const createNotFoundError = (message) => {
    const error = new Error(message);
    error.statusCode = 404;
    return error;
};

const createBadRequestError = (message) => {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
};

// Save a post
export const savePostService = async (userId, postId) => {
    const post = await Post.findOne({ where: { post_id: postId, is_active: true } });
    if (!post) {
        throw createNotFoundError("Post not found or has been deactivated.");
    }

    const [saved, created] = await SavedPost.findOrCreate({
        where: { user_id: userId, post_id: postId }
    });

    if (!created) {
        throw createBadRequestError("Post is already saved.");
    }

    return saved;
};

// Unsave a post
export const unsavePostService = async (userId, postId) => {
    const deletedCount = await SavedPost.destroy({
        where: { user_id: userId, post_id: postId }
    });

    if (deletedCount === 0) {
        throw createNotFoundError("Saved post record not found.");
    }

    return { message: "Post removed from saved items." };
};

// Get saved posts
export const getSavedPostsService = async (userId, query = {}) => {
    return await hybridLoad(SavedPost, {
        page: query.page,
        limit: query.limit,
        where: { user_id: userId },
        include: [
            {
                model: Post,
                as: "post",
                where: { is_active: true }, 
                include: [
                    {
                        model: PhotoData,
                        as: "photo"
                    }
                ]
            }
        ],
        order: [["created_at", "DESC"]]
    });
};