import { Router } from "express";
import { register } from "../controller/auth.controller.js";
import { login } from "../controller/login.controller.js";
import { logout } from "../controller/logout.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);

export default router;