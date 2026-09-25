import express from "express";
import { 
    sendFriendRequest, 
    acceptFriendRequest, 
    declineFriendRequest, 
    getFriendsList, 
    getPendingRequestsList, 
    removeFriend 
} from "../controller/user/friend.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

import { rateLimiter } from "../middleware/ratelimiter.middleware.js";

const router = express.Router();

router.use(isAuthenticated); 


router.post("/request/:userId", rateLimiter(10, 60000), sendFriendRequest);     
router.patch("/accept/:userId", rateLimiter(20, 60000), acceptFriendRequest);   
router.patch("/decline/:userId", rateLimiter(20, 60000), declineFriendRequest); 

router.get("/", getFriendsList);
router.get("/requests/pending", getPendingRequestsList);

router.delete("/:userId", rateLimiter(10, 60000), removeFriend);                
router.get("/suggestions", getSuggestions);
export default router;