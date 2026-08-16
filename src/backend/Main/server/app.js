import express from "express";
import { rateLimiter } from "../middleware/ratelimiter.middleware.js";
const app = express();

app.use(express.json());
app.use(rateLimiter(100,60000));


export default app;