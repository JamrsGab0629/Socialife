import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/auth.middleware";
import * as reportController from "../controller/post/report.controller.js";

const router = express.Router();

router.use(isAuthenticated);

// --- USER ENDPOINTS ---

// POST /api/report/
router.post("/", reportController.addReport);

// GET /api/report/
router.get("/", reportController.getReports);

export default router;