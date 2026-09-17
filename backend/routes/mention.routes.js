import express from "express";
import { 
    mentionController
} from "../controller/post/mention.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router()

router.use(isAuthenticated);

/** POST /api/mention/
 * Interface body = {
 *  mention: userId[],
 *  entityId: post_id || comment_id,
 *  type: comment || post,
 * }
 * */

router.post('/', mentionController)

export default router