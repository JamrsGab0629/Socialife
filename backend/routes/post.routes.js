import express from "express";

import * as postController from "../controller/post/post.controller.js";
import * as likeController from "../controller/post/like.controller.js";
import * as commentController from "../controller/post/comment.controller.js";

import { isAuthenticated } from "../middleware/auth.middleware.js";
import { uploadPostImage } from "../middleware/postUpload.middleware.js";
import { rateLimiter } from "../middleware/ratelimiter.middleware.js";

import validate from "../validators/main.validator.js";

import {
    createPostSchema,
    getHomeFeedSchema,
    getProfileFeedSchema,
    deactivatePostSchema,
} from "../validators/post.validators.js";

import {
    toggleLikeSchema,
} from "../validators/like.validators.js";

import {
    addCommentSchema,
    addReplySchema,
    getCommentsSchema,
    getRepliesSchema,
} from "../validators/comment.validator.js";

const router = express.Router();

//  POSTS 

router.post(
    "/",
    isAuthenticated,
    rateLimiter(5, 60000),
    uploadPostImage,
    validate(createPostSchema),
    postController.createPost
);

router.get(
    "/",
    isAuthenticated,
    validate(getHomeFeedSchema),
    postController.getHomeFeed
);

router.get(
    "/user/:userId",
    isAuthenticated,
    validate(getProfileFeedSchema),
    postController.getProfileFeed
);

router.patch(
    "/:postId/deactivate",
    isAuthenticated,
    validate(deactivatePostSchema),
    postController.deactivatePost
);

// LIKES 

router.post(
    "/:postId/like",
    isAuthenticated,
    rateLimiter(15, 60000),
    validate(toggleLikeSchema),
    likeController.toggleLike
);

// COMMENTS

router.post(
    "/:postId/comments",
    isAuthenticated,
    rateLimiter(10, 60000),
    validate(addCommentSchema),
    commentController.addComment
);

router.get(
    "/:postId/comments",
    isAuthenticated,
    validate(getCommentsSchema),
    commentController.getComments
);

// REPLIES

router.post(
    "/:postId/:parentId/replies",
    isAuthenticated,
    rateLimiter(10, 60000),
    validate(addReplySchema),
    commentController.addReply
);

router.get(
    "/:postId/:parentId/replies",
    isAuthenticated,
    validate(getRepliesSchema),
    commentController.getReplies
);

export default router;