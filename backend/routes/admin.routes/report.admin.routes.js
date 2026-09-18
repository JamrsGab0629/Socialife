import express from "express";
import { 
    getAllReports, 
    updateReportStatus, 
} from "../../controller/post/report.controller.js";

const router = express.Router();

// --- ADMIN ENDPOINTS ---

/** 
 * GET /api/admin/reports/get/:status?
 * @param {string} [status] - "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED" | "ALL"
 * @query {number} [page=1]
 * @query {number} [limit=10]
 */
router.get("/get/:status", getAllReports);

/** 
 * PUT /api/admin/reports/:reportId/update
 * @param {string} reportId - UUID of the report
 * @body {string} [status] - "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED"
 * @body {string} [severity] - "NONE" | "LOW" | "MEDIUM" | "HIGH"
 * @body {string} [resolution] - "NO_ACTION" | "WARNING_ISSUED" | "CONTENT_REMOVED" | "SUSPENDED" | "DEACTIVATED"
 */
router.put("/:reportId/update", updateReportStatus);

export default router;