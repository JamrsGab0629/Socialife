import { Router } from 'express';
import { profileController } from '../controller/user/profile.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js'; 
import { upload } from '../middleware/profile.middleware.js'; 
import { rateLimiter } from '../middleware/ratelimiter.middleware.js';

const router = Router();

// GET /api/profiles/me
router.get('/me', isAuthenticated, profileController.getMyProfile);

// PUT /api/profiles/picture
router.put('/picture', isAuthenticated, rateLimiter(20, 60000), upload.single('image'), profileController.updatePicture);

// GET /api/profiles/user/:username
router.get("/user/:username", isAuthenticated, profileController.getUserProfile);


// GET /api/profiles/:userId/feed -> Unified profile timeline (sorted mix of original & shared posts)
router.get('/:userId/feed', isAuthenticated, profileController.getProfileFeed);

// GET /api/profiles/:userId/friend-stats -> Lightweight stats (name and friend count)
router.get('/:userId/friend-stats', isAuthenticated, profileController.getFriendCountAndName);

router.delete('/picture', isAuthenticated, rateLimiter(20, 60000), profileController.removePicture);

router.put('/cover', isAuthenticated, rateLimiter(20, 60000), upload.single('image'), profileController.updateCover);
router.delete('/cover', isAuthenticated, rateLimiter(20, 60000), profileController.removeCover);
export default router;