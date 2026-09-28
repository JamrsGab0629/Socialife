import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import * as settingsController from "../controller/user/settings.controller.js";

const routes = express.Router();

routes.use(isAuthenticated);

/**
 * POST /api/settings/change-password
 * BODY password [string]
 * BODY new_password [string]
 */
routes.post("/change-password", settingsController.changePassword);

export default routes;