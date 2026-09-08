import { profileService } from '../services/profile.service.js';
import * as profileFeedService from '../services/profileFeed.service.js'; 

export const profileController = {
  // GET /api/profiles/me
  async getMyProfile(req, res, next) {
    try {
      const userId = req.user.userId;
      const profile = await profileService.getProfileById(userId);

      return res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      next(error);
    }
  },

  // PUT /api/profiles/picture
  async updatePicture(req, res, next) {
    try {
      const userId = req.user.userId;

      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No image file provided' });
      }

      // req.file.path contains the secure Cloudinary URL from Multer
      const updatedProfile = await profileService.updateProfilePicture(userId, req.file.path);

      return res.status(200).json({
        success: true,
        message: 'Profile picture updated successfully',
        data: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/profiles/user/:username
  async getUserProfile(req, res, next) {
    try {
      const { username } = req.params;

      if (!username) {
        return res.status(400).json({ success: false, message: 'Username parameter is required' });
      }

      const profile = await profileService.getProfileByUsername(username);

      return res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      next(error);
    }
  },

  // for the profile the post is random eg post and shared post
  async getProfileFeed(req, res, next) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID parameter is required' });
      }

      const feedResult = await profileFeedService.getUnifiedProfileFeedService(userId, req.query);

      return res.status(200).json({
        success: true,
        ...feedResult,
      });
    } catch (error) {
      next(error);
    }
  },

  async getFriendCountAndName(req, res, next) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID parameter is required' });
      }

      const stats = await profileService.getFriendCountAndName(userId);

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      next(error);
    }
  }
};