import { Router } from "express";
import { register } from "../controller/auth/auth.controller.js";
import { signingup } from "../controller/auth/signup.controller.js";
import { login } from "../controller/auth/login.controller.js";
import { logout } from "../controller/auth/logout.controller.js";
import { state } from "../controller/state.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/signup", signingup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/is-authenticated", isAuthenticated);

router.get("/state", state);

export default router;