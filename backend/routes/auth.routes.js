import { Router } from "express";
import { register } from "../controller/auth/auth.controller.js";
import { signingup } from "../controller/auth/signup.controller.js";
import { login } from "../controller/auth/login.controller.js";
import { logout } from "../controller/auth/logout.controller.js";
import { state } from "../controller/state.controller.js";
import { checkAuth } from "../controller/auth/checkAuth.controller.js";
import { refresh } from "../controller/auth/refresh.controller.js";
import { isAdmin, isAuthenticated } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/signup", signingup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/checkAuth", isAuthenticated, checkAuth);

//auth-role
router.post("/ckeckAdmin", isAuthenticated, isAdmin, checkAuth);

router.get("/state", state);

// refreshing access token
router.post("/refresh", refresh);

export default router;