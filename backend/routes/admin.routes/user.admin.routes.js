import express from "express";
import * as userController from "../../controller/admin/user.admin.controller.js";

const router = express.Router();

// --- ADMIN ENDPOINTS ---

/** 
 * GET /api/admin/user/get/:status?
 * @param {string} [status] - "ACTIVE" | "BLOCKED" | "ALL"
 * @query {number} [page=1]
 * @query {number} [limit=10]
 */
router.get("/get/:status", userController.getUsers);

/** 
 * GET /api/admin/user/find/:username?
 * @param {string} [username]
 */
router.get("/find/:username", userController.getByUsername);

/** 
 * GET /api/admin/user/view/:userId?
 * @param {string} [username]
 */
router.get("/view/:userId", userController.viewUser);

/** 
 * PUT /api/admin/user/:userId/block
 * @param {string} userId - UUID of the report
 */
router.put("/:userId/block", userController.toggleBlock);

export default router;