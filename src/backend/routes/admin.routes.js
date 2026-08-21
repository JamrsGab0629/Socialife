import { Router } from "express";
import { isAuthenticated, isAdmin } from "../middleware/auth.middleware.js";
import { getDashboard, getAllUsers } from "../controller/admin.controller.js";

const router = Router();


router.use(isAuthenticated, isAdmin);


router.get("/dashboard", getDashboard);
router.get("/users", getAllUsers);

export default router;