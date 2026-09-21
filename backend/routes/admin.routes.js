import { Router } from "express";
import { isAuthenticated, isAdmin } from "../middleware/auth.middleware.js";
import { getDashboard, getAllUsers } from "../controller/admin/admin.controller.js";
import reportRoute from "./admin.routes/report.admin.routes.js";
import userRoute from "./admin.routes/user.admin.routes.js";

const router = Router();


router.use(isAuthenticated, isAdmin);

router.get("/dashboard", getDashboard);
router.get("/users", getAllUsers);


router.use("/report", reportRoute);
router.use("/user", userRoute);

export default router;