import express from "express";
import * as teamController from "../../controller/admin/team.admin.controller.js";

const router = express.Router();

/**
 * GET /api/admin/team/get
 * @param {string} role - "ADMIN" | "SUPERADMIN"
 * @query {number} [page=1]
 * @query {number} [limit=10]
 */
router.get("/get/:role", teamController.getTeamMembers);

/**
 * POST /api/admin/team/add
 * @body {number} userId - ID of the user to promote/add
 * @body {string} [role="ADMIN"] - "ADMIN" 
 */
router.post("/add", teamController.addAdminMember);

/**
 * PATCH /api/admin/team/:memberId/role
 * @param {string} memberId - ID of the team member
 * @body {string} role - "USER" | "ADMIN" | "SUPERADMIN"
 */
router.put("/:memberId/role", teamController.updateMemberRole);

export default router;