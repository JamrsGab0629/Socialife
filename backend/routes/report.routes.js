import express from "express";
import {
    isAuthenticated,
    isAdmin,
} from "../middleware/auth.middleware.js";
import * as reportController from "../controller/post/report.controller.js";

const router = express.Router();

router.use(isAuthenticated);

// --- USER ENDPOINTS ---

// POST /api/report/
router.post("/", reportController.addReport);

// GET /api/report/
router.get("/", isAdmin,reportController.getReports);

export default router;