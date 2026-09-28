import express from "express";
import { 
    mentionController
} from "../controller/post/mention.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { rateLimiter } from "../middleware/ratelimiter.middleware.js";

const router = express.Router()

router.use(isAuthenticated);

/** POST /api/mention/
 * Interface body = {
 *  mentions: userId[],
 *  entityId: post_id || comment_id,
 *  type: comment || post,
 * }
 * */

router.post('/',
    rateLimiter(50, 60000),
    mentionController
)

export default router