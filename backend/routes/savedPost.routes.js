import express from "express";
import * as savedPostController from "../controller/post/savedPost.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { postIdSchema, validate } from "../validators/savedPost.validator.js";
import { rateLimiter } from "../middleware/ratelimiter.middleware.js"; // 1. Import rate limiter

const router = express.Router();


router.use(isAuthenticated);


router.post("/:postId", rateLimiter(20, 60000), validate(postIdSchema), savedPostController.savePost);
router.delete("/:postId", rateLimiter(20, 60000), validate(postIdSchema), savedPostController.unsavePost);
router.get("/", savedPostController.getSavedPosts);

export default router;