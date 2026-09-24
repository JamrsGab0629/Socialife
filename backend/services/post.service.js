import { Post, SharedPost, User, PhotoData, SavedPost } from "../model/association.model.js";
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

export const getHomeFeedService = async (userId, query = {}) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 10);
  const postIncludes = [
    {
      model: User,
      as: "author",
      attributes: ["user_id", "username", "profile_url"],
    },
    {
      model: PhotoData,
      as: "photo",
    },
    {
      model: SavedPost,
      as: "saves",
      attributes: ["post_id"],
      where: { user_id: userId },
      required: false,
    },
  ];

  const [posts, shares] = await Promise.all([
    Post.findAll({
      where: { is_active: true },
      include: postIncludes,
    }),
    SharedPost.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "username", "profile_url"],
        },
        {
          model: Post,
          as: "post",
          where: { is_active: true },
          include: postIncludes,
        },
      ],
    }),
  ]);

  const originalPosts = posts.map((post) => {
    const { saves = [], ...postData } = post.toJSON();
    return { ...postData, is_saved: saves.length > 0 };
  });

  const sharedPosts = shares.map((share) => {
    const shareData = share.toJSON();
    const { saves = [], ...postData } = shareData.post;
    return {
      ...postData,
      is_saved: saves.length > 0,
      is_shared: true,
      shared_by: shareData.user,
      share_caption: shareData.caption,
      shared_at: shareData.created_at,
      feed_id: shareData.share_id,
    };
  });

  const feed = [...originalPosts, ...sharedPosts]
    .sort((a, b) => new Date(b.shared_at || b.created_at) - new Date(a.shared_at || a.created_at));
  const offset = (page - 1) * limit;
  const data = feed.slice(offset, offset + limit);

  return {
    data,
    pagination: {
      page,
      limit,
      totalItems: feed.length,
      totalPages: Math.ceil(feed.length / limit),
      hasMore: offset + data.length < feed.length,
    },
  };
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
export const getUserPhotosService = async (userId) => {
  const photos = await PhotoData.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Post,
        as: "post",
        attributes: ["post_id", "is_active"],
        where: { is_active: true },
        required: true,
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return photos.map((p) => p.toJSON());
};
