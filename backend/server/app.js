import express from "express";
import { rateLimiter } from "../middleware/ratelimiter.middleware.js";
import cookieParser from "cookie-parser";   
import authRoutes from "../routes/auth.routes.js";
import adminRoutes from "../routes/admin.routes.js";
import otpRoutes from "../routes/otp.routes.js"; 
import profileRoutes from "../routes/profile.routes.js"; 
import postRoutes from "../routes/post.routes.js"; 
import savedPostRoutes from "../routes/savedPost.routes.js"; 
import sharedPostRoutes from "../routes/sharedPost.routes.js";
import friendRoutes from "../routes/friend.routes.js";
import notificationRoutes from "../routes/notifications.routes.js";
import cors from "cors";

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true 
}))

app.use(express.json());
app.use(rateLimiter(100,60000));
app.use(cookieParser());

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", otpRoutes);
app.use("/api/profiles", profileRoutes); 
app.use("/api/posts", postRoutes); 
app.use("/api/saved-posts", savedPostRoutes); 
app.use("/api/posts", sharedPostRoutes); 
app.use("/api/friends", friendRoutes);
app.use("/api/notifications", notificationRoutes);

export default app;