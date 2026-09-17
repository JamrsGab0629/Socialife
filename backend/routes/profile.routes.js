import { Router } from 'express';
import { profileController } from '../controller/user/profile.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js'; 
import { upload } from '../middleware/profile.middleware.js'; 
import { rateLimiter } from '../middleware/ratelimiter.middleware.js';

const router = Router();

// GET /api/profiles/me
router.get('/me', isAuthenticated, profileController.getMyProfile);

// PUT /api/profiles/picture
router.put('/picture', isAuthenticated, rateLimiter(5, 60000), upload.single('image'), profileController.updatePicture);

// GET /api/profiles/user/:username
router.get("/user/:username", isAuthenticated, profileController.getUserProfile);


// GET /api/profiles/:userId/feed -> Unified profile timeline (sorted mix of original & shared posts)
router.get('/:userId/feed', isAuthenticated, profileController.getProfileFeed);

// GET /api/profiles/:userId/friend-stats -> Lightweight stats (name and friend count)
router.get('/:userId/friend-stats', isAuthenticated, profileController.getFriendCountAndName);

export default router;