import { Router } from "express";
import { isAuthenticated, isAdmin } from "../middleware/auth.middleware.js";
import { getDashboard, getAllUsers } from "../controller/admin/admin.controller.js";
import reportRoute from "./admin.routes/report.admin.routes.js";
import userRoute from "./admin.routes/user.admin.routes.js";
import postRoute from "./admin.routes/post.admin.routes.js";
import teamRoute from "./admin.routes/team.admin.routes.js";

const router = Router();


router.use(isAuthenticated, isAdmin);

router.get("/dashboard", getDashboard);
router.get("/users", getAllUsers);

// ADMIN ROUTES
router.use("/report", reportRoute);
router.use("/user", userRoute);
router.use("/post", postRoute);
router.use("/team", teamRoute);
export default router;