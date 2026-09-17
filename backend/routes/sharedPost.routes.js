import express from "express";
import * as sharedPostController from "../controller/post/sharedPost.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js"; 
import { rateLimiter } from "../middleware/ratelimiter.middleware.js";
const router = express.Router();

// Protected route: Users must be logged in to share a post
router.post("/:postId/share", isAuthenticated, rateLimiter(5, 60000), sharedPostController.sharePost);

export default router;