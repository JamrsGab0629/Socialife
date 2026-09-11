import express from "express";
import * as postController from "../controller/post.controller.js";
import * as likeController from "../controller/like.controller.js";
import * as commentController from "../controller/comment.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { uploadPostImage } from "../middleware/postUpload.middleware.js"; 

const router = express.Router();

// --- Post Routes ---
router.post("/", isAuthenticated, uploadPostImage, postController.createPost);
router.get("/", isAuthenticated, postController.getHomeFeed);
router.get("/user/:userId", isAuthenticated, postController.getProfileFeed);
router.patch("/:postId/deactivate", isAuthenticated, postController.deactivatePost);

// --- Like Routes ---
router.post("/:postId/like", isAuthenticated, likeController.toggleLike);

// --- Comment Routes ---
router.post("/:postId/comments", isAuthenticated, commentController.addComment);
router.get("/:postId/comments", isAuthenticated, commentController.getComments);

export default router;