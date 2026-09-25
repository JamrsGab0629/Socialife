import express from "express";
import * as notificationController from "../controller/user/notifications.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { rateLimiter } from "../middleware/ratelimiter.middleware.js";
import validate from "../validators/main.validator.js";
import { 
    notificationParamSchema, 
    notificationQuerySchema 
} from "../validators/notifications.validator.js";

const router = express.Router();

router.get(
    "/", 
    isAuthenticated, 
    rateLimiter(60, 60000),
    validate(notificationQuerySchema), 
    notificationController.getNotifications
);

router.patch(
    "/:notificationId/read", 
    isAuthenticated, 
    validate(notificationParamSchema),
    notificationController.markAsRead
);

export default router;