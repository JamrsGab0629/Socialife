import { Router } from 'express';
import { profileController } from '../controller/profile.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js'; 
import { upload } from '../middleware/profile.middleware.js'; 

const router = Router();

// GET /api/profiles/me
router.get('/me', isAuthenticated, profileController.getMyProfile);

// PUT /api/profiles/picture
router.put('/picture', isAuthenticated, upload.single('image'), profileController.updatePicture);

export default router;