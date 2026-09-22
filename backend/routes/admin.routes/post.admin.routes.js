import express from "express";
import * as postController from "../../controller/admin/post.admin.controller.js";

const router = express.Router();

/**
 * GET /api/admin/post/get/:status?
 * @param {string} [status] - "ACTIVE" | "BLOCKED" | "ALL"
 * @query {number} [page=1]
 * @query {number} [limit=10]
 */
router.get("/get/:status", postController.getPosts);

/**
 * GET /api/admin/post/from/:username
 * @param {string} username
 * @query {number} [page=1]
 * @query {number} [limit=10]
 */
router.get("/from/:username", postController.getByUsername);

/**
 * GET /api/admin/post/view/:postId
 * @param {string} postId
 */
router.get("/view/:postId", postController.viewPost);

/**
 * PUT /api/admin/post/:postId/remove
 * @param {string} postId - UUID of the post
 */
router.put("/:postId/remove", postController.removePost);

export default router;