import express from "express";
import {
    getAllData
} from "../../controller/admin/getAllData.admin.controller.js";

const router = express.Router();

// --- ADMIN ENDPOINTS ---

/** 
 * GET /api/admin/dashboard/
 */
router.get("/", getAllData);

export default router;