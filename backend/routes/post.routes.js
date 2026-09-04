import express from "express";
import * as postController from "../controller/post.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js"; // Use isAuthenticated here
import { uploadPostImage } from "../middleware/postUpload.middleware.js"; 

const router = express.Router();

// Update verifyAuth to isAuthenticated
router.post("/", isAuthenticated, uploadPostImage, postController.createPost);
router.get("/", isAuthenticated, postController.getHomeFeed);
router.get("/user/:userId", isAuthenticated, postController.getProfileFeed);
router.patch("/:postId/deactivate", isAuthenticated, postController.deactivatePost);

// Like routes
router.post("/:postId/like", isAuthenticated, postController.toggleLike);

// Comment routes
router.post("/:postId/comments", isAuthenticated, postController.addComment);
router.get("/:postId/comments", isAuthenticated, postController.getComments);

export default router;