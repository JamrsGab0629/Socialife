import express from "express";
import * as notificationController from "../controller/user/notifications.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", isAuthenticated, notificationController.getNotifications);
router.patch("/:notificationId/read", isAuthenticated, notificationController.markAsRead);

export default router;