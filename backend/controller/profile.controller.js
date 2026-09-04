import { profileService } from '../services/profile.service.js';

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
  }
};