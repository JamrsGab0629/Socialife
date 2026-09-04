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
  }
};