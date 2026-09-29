import { profileService } from '../../services/profile.service.js';
import * as profileFeedService from '../../services/profileFeed.service.js';
import * as postService from '../../services/post.service.js';

export const profileController = {
  // GET /api/profiles/me
  async getMyProfile(req, res, next) {
    try {
      const userId = req.user.user_id || req.user.userId;
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
    const userId = req.user.user_id || req.user.userId;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const updatedProfile = await profileService.updateProfilePicture(userId, req.file.path);

    const userCaption = req.body?.caption?.trim();
    const caption = userCaption
      ? `updated their profile picture — ${userCaption}`
      : "updated their profile picture";

    const createdPost = await postService.createPostService(
      userId,
      { caption },
      req.file
    );

    const postId = createdPost?.post_id || createdPost?.id;
    if (postId) {
      await profileService.setProfilePicturePost(userId, postId);
    }

    return res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      data: { ...updatedProfile, profile_picture_post_id: postId || null },
    });
  } catch (error) {
    next(error);
  }
},

  // DELETE /api/profiles/picture
  async removePicture(req, res, next) {
    try {
      const userId = req.user.user_id || req.user.userId;
      const updatedProfile = await profileService.removeProfilePicture(userId);

      return res.status(200).json({
        success: true,
        message: 'Profile picture removed successfully',
        data: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/profiles/cover
 async updateCover(req, res, next) {
  try {
    const userId = req.user.user_id || req.user.userId;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const updatedProfile = await profileService.updateCoverPhoto(userId, req.file.path);

    const userCaption = req.body?.caption?.trim();
    const caption = userCaption
      ? `updated their cover photo — ${userCaption}`
      : "updated their cover photo";

    const createdPost = await postService.createPostService(
      userId,
      { caption },
      req.file
    );

    const postId = createdPost?.post_id || createdPost?.id;
    if (postId) {
      await profileService.setCoverPhotoPost(userId, postId);
    }

    return res.status(200).json({
      success: true,
      message: 'Cover photo updated successfully',
      data: { ...updatedProfile, cover_photo_post_id: postId || null },
    });
  } catch (error) {
    next(error);
  }
},

  // DELETE /api/profiles/cover
  async removeCover(req, res, next) {
    try {
      const userId = req.user.user_id || req.user.userId;
      const updatedProfile = await profileService.removeCoverPhoto(userId);

      return res.status(200).json({
        success: true,
        message: 'Cover photo removed successfully',
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

    // for the profile the post is random eg post and shared post
  async getProfileFeed(req, res, next) {
    try {
      const { userId } = req.params;
      const viewerId = req.user.userId || req.user.user_id;

      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID parameter is required' });
      }

      const feedResult = await profileFeedService.getUnifiedProfileFeedService(userId, viewerId, req.query);

      return res.status(200).json({
        success: true,
        ...feedResult,
      });
    } catch (error) {
      next(error);
    }
  },

    // GET /api/profiles/search?q=...
  async searchUsers(req, res, next) {
    try {
      const userId = req.user.user_id || req.user.userId;
      const { q } = req.query;

      const results = await profileService.searchUsers(q, userId);

      return res.status(200).json({
        success: true,
        data: results,
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