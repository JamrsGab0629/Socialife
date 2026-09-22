import { Post, User, PhotoData } from "../model/association.model.js";
import { hybridLoad } from "../utils/loaders/hybrid.loader.js";
export { getUnifiedProfileFeedService as getProfileFeedService } from "./profileFeed.service.js";

const createNotFoundError = (message) => {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
};

export const createPostService = async (userId, body, file) => {
  const transaction = await Post.sequelize.transaction();

  try {
    const caption = body.caption || body.content || null;
    const content = body.content || body.caption || null;

    const newPost = await Post.create(
      {
        user_id: userId,
        caption: caption,
        content: content,
        like_count: 0,
        comment_count: 0,
        is_active: true,
      },
      {
        transaction,
      },
    );

    let savedPhoto = null;

    if (file) {
      savedPhoto = await PhotoData.create(
        {
          user_id: userId,
          post_id: newPost.post_id,
          href: file.path || file.secure_url || file.url,
        },
        {
          transaction,
        },
      );
    }

    await transaction.commit();

    // Re-fetch post with author and photo associations for immediate frontend rendering
    const completePost = await Post.findOne({
      where: { post_id: newPost.post_id },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["user_id", "username", "profile_url"],
        },
        {
          model: PhotoData,
          as: "photo",
        },
      ],
    });

    return completePost || { ...newPost.toJSON(), photo: savedPhoto };
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    throw error;
  }
};

export const getHomeFeedService = async (query = {}) => {
  return hybridLoad(Post, {
    page: query.page,
    limit: query.limit,

    where: {
      is_active: true,
    },

    include: [
      {
        model: User,
        as: "author",
        attributes: ["user_id", "username", "profile_url"],
      },
      {
        model: PhotoData,
        as: "photo",
      },
    ],

    order: [["created_at", "DESC"]],
  });
};


export const deactivatePostService = async (postId, userId) => {
  const post = await Post.findOne({
    where: {
      post_id: postId,
      user_id: userId,
      is_active: true,
    },
  });

  if (!post) {
    throw createNotFoundError("Post not found or already deactivated");
  }

  post.is_active = false;
  await post.save();

  return post;
};

export const getPostByIdService = async (postId, userId) => {
  return Post.findOne({
    where: {
      post_id: postId,
      user_id: userId,
      is_active: true,
    },

    include: [
      {
        model: User,
        as: "author",
        attributes: ["user_id", "username", "profile_url"],

        where: {
          is_active: true,
        },
      },
      {
        model: PhotoData,
        as: "photo",
      },
    ],
  });
};