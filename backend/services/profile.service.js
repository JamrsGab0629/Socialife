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
        is_active: true
      },
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },

  // Fetch only the name and friend count fields for a user
  async getFriendCountAndName(userId) {
    const user = await User.findByPk(userId, {
      attributes: ["username", "first_name", "last_name", "friend_count"]
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
};