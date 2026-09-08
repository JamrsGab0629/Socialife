import { SharedPost, Post, User } from "../model/association.model.js"; // Fixed extension typo

export const createShareRecord = async (userId, postId, caption) => {
  // 1. Verify that the post exists and is active before allowing a share
  const post = await Post.findOne({
    where: { post_id: postId, is_active: true }
  });

  if (!post) {
    throw new Error("Post not found or has been deactivated");
  }

  // 2. Create the share record
  return await SharedPost.create({
    user_id: userId,
    post_id: postId,
    caption: caption || null,
  });
};

export const getPostShares = async (postId) => {
  return await SharedPost.findAll({
    where: { post_id: postId },
    include: [{ model: User, as: "user", attributes: ["user_id", "username", "profile_url"] }],
  });
};