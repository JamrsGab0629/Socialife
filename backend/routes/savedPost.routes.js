import express from "express";
import * as savedPostController from "../controller/savedPost.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { postIdSchema, validate } from "../validators/savedPost.validator.js";

const router = express.Router();

// Protect all saved post routes using your HTTP-only cookie authentication middleware
router.use(isAuthenticated);

// Endpoints
router.post("/:postId", validate(postIdSchema), savedPostController.savePost);
router.delete("/:postId", validate(postIdSchema), savedPostController.unsavePost);
router.get("/", savedPostController.getSavedPosts);

export default router;