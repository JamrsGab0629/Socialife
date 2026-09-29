import User from '../model/user.model.js';

export const profileService = {
  // Fetch profile by ID (excluding the hashed password)
  async getProfileById(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },

  // Update profile picture URL from Cloudinary
  async updateProfilePicture(userId, fileUrl) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.profile_url = fileUrl;
    await user.save();

    return {
      profile_url: user.profile_url,
    };
  },

  // Reset profile picture back to default (null)
  async removeProfilePicture(userId) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.profile_url = null;
    await user.save();

    return {
      profile_url: user.profile_url,
    };
  },

  // Update cover photo URL from Cloudinary
  async updateCoverPhoto(userId, fileUrl) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.cover_url = fileUrl;
    await user.save();

    return {
      cover_url: user.cover_url,
    };
  },

      async searchUsers(query, excludeUserId) {
    if (!query || !query.trim()) return [];

    const { Op } = await import('sequelize');

    return await User.findAll({
      where: {
        username: { [Op.iLike]: `%${query.trim()}%` },
        is_actived: true
      },
      attributes: ['user_id', 'username', 'profile_url'],
      limit: 15
    });
  },

  // Reset cover photo back to default (null)
  async removeCoverPhoto(userId) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.cover_url = null;
    await user.save();

    return {
      cover_url: user.cover_url,
    };
  },

    async getProfileByUsername(username) {
    const user = await User.findOne({
      where: {
        username,
        is_actived: true
      },
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },

  async setProfilePicturePost(userId, postId) {
  await User.update(
    { profile_picture_post_id: postId },
    { where: { user_id: userId } }
  );
},

async setCoverPhotoPost(userId, postId) {
  await User.update(
    { cover_photo_post_id: postId },
    { where: { user_id: userId } }
  );
},
  
    async getFriendCountAndName(userId) {
  const user = await User.findByPk(userId, {
    attributes: [
      "user_id", "username", "first_name", "last_name", "friend_count",
      "profile_url", "cover_url", "birth_date", "created_at",
      "profile_picture_post_id", "cover_photo_post_id"
    ]
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}};