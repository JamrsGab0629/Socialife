import { Post, User, PhotoData } from "../model/association.model.js";
import { hybridLoad } from "../utils/loaders/hybrid.loader.js";

export const createPostService = async (userId, body, file) => {
    const t = await Post.sequelize.transaction();
    try {
        const newPost = await Post.create({
            user_id: userId,
            caption: body.caption,
            content: body.content,
            like_count: 0,
            comment_count: 0,
            is_active: true
        }, { transaction: t });

        let savedPhoto = null;
        if (file) {
            savedPhoto = await PhotoData.create({
                user_id: userId,
                post_id: newPost.post_id,
                href: file.path
            }, { transaction: t });
        }

        await t.commit();
        return { post: newPost, photo: savedPhoto };
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

export const getHomeFeedService = async (query) => {
    return await hybridLoad(Post, {
        page: query.page,
        limit: query.limit,
        where: { is_active: true },
        include: [
            { model: User, as: "author", attributes: ["user_id", "username", "profile_url"] },
            { model: PhotoData, as: "photo" },
        ],
        order: [["created_at", "DESC"]]
    });
};

export const getProfileFeedService = async (targetUserId, query) => {
    return await hybridLoad(Post, {
        page: query.page,
        limit: query.limit,
        where: { user_id: targetUserId, is_active: true },
        include: [
            { model: User, as: "author", attributes: ["user_id", "username", "profile_url"] },
            { model: PhotoData, as: "photo" }
        ],
        order: [["created_at", "DESC"]]
    });
};

export const deactivatePostService = async (postId, userId) => {
    const post = await Post.findOne({ where: { post_id: postId, user_id: userId } });
    if (!post) throw new Error("Post not found or unauthorized");

    post.is_active = false;
    await post.save();
    return post;
};

export const getPostById = async (postId, userId) => {
  return await Post.findOne({
    where: { 
      post_id: postId, 
      user_id: userId 
    },
    include: [
      {
        model: User,
        as: "users", // Must match the alias defined in your association model
        where: { is_active: true }
      }
    ]
  });
};