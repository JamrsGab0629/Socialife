import express from "express";
import * as savedPostController from "../controller/post/savedPost.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import validate from "../validators/main.validator.js";
import { postIdSchema, paginationSchema } from "../validators/savedPost.validator.js"; 
import { rateLimiter } from "../middleware/ratelimiter.middleware.js";

const router = express.Router();

router.post(
    "/:postId", 
    isAuthenticated, 
    rateLimiter(50, 60000), 
    validate(postIdSchema), 
    savedPostController.savePost
);

router.delete(
    "/:postId", 
    isAuthenticated, 
    rateLimiter(20, 60000), 
    validate(postIdSchema), 
    savedPostController.unsavePost
);

router.get(
    "/", 
    isAuthenticated, rateLimiter(60, 60000),
    validate(paginationSchema), 
    savedPostController.getSavedPosts
);

export default router;
