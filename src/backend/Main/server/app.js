import express from "express";
import { rateLimiter } from "../middleware/ratelimiter.middleware.js";
import cookieParser from "cookie-parser";   
import authRoutes from "../routes/auth.routes.js";
import adminRoutes from "../routes/admin.routes.js";
const app = express();

app.use(express.json());
app.use(rateLimiter(100,60000));
app.use(cookieParser());
app.use("/api/admin", adminRoutes);


app.use("/api/auth", authRoutes);
export default app;