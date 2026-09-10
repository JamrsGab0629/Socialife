import express from "express";
import { 
    sendFriendRequest, 
    acceptFriendRequest, 
    declineFriendRequest, 
    getFriendsList, 
    getPendingRequestsList, 
    removeFriend 
} from "../controller/friend.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { friendParamSchema } from "../validators/friend.validator.js";

const router = express.Router();

router.use(isAuthenticated); // Protect all friend routes


router.post("/request/:userId", sendFriendRequest);
router.patch("/accept/:userId", acceptFriendRequest);
router.patch("/decline/:userId", declineFriendRequest);
router.get("/", getFriendsList);
router.get("/requests/pending", getPendingRequestsList);
router.delete("/:userId", removeFriend);

export default router;