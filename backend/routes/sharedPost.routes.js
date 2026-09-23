import express from "express";
import * as sharedPostController from "../controller/post/sharedPost.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js"; 
import { rateLimiter } from "../middleware/ratelimiter.middleware.js";
import validate from "../validators/main.validator.js"; 
import { sharePostSchema } from "../validators/sharedPost.validator.js"; 

const router = express.Router();

router.post(
    "/:postId/share", 
    isAuthenticated, 
    rateLimiter(30, 60000), 
    validate(sharePostSchema), 
    sharedPostController.sharePost
);

export default router;