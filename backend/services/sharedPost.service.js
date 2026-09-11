import SavedPost from "../model/savedPost.model.js";
import Post from "../model/post.model.js";
import PhotoData from "../model/photo_data.model.js";
import { hybridLoad } from "../utils/loaders/hybrid.loader.js";
import { safeNotify } from "../utils/notify.util.js";

export const savePostService = async (userId, postId) => {
  const post = await Post.findOne({
    where: { post_id: postId, is_active: true },
  });
  if (!post) {
    throw new Error("No post");
  }

  const [saved, created] = await SavedPost.findOrCreate({
    where: { user_id: userId, post_id: postId },
  });

  if (!created) {
    throw new Error("Saved");
  }

  safeNotify(post.user_id, userId, "save", "saved your post.");
  return saved;
};

export const unsavePostService = async (userId, postId) => {
  const deletedCount = await SavedPost.destroy({
    where: { user_id: userId, post_id: postId },
  });

  if (deletedCount === 0) {
    throw new Error("Hindi naka-save");
  }

  return { message: "Post removed from saved items." };
};

export const getSavedPostsService = async (userId, page, limit) => {
  return await hybridLoad(SavedPost, {
    page,
    limit,
    where: { user_id: userId },
    include: [
      {
        model: Post,
        as: "post",
        where: { is_active: true },
        include: [
          {
            model: PhotoData,
            as: "photo",
          },
        ],
      },
    ],
    order: [["created_at", "DESC"]],
  });
};
