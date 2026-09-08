import express from "express";
import * as sharedPostController from "../controller/sharedPost.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js"; 

const router = express.Router();

// Protected route: Users must be logged in to share a post
router.post("/:postId/share", isAuthenticated, sharedPostController.sharePost);

export default router;