import { z } from "zod";

export const addCommentSchema = z.object({
    body: z.object({
        comment: z.string().trim().min(1, "Comment body cannot be empty"),
    }),
    params: z.object({
        postId: z.string().uuid(),
    }),
    query: z.object({}).optional(),
});

export const addReplySchema = z.object({
    body: z.object({
        comment: z.string().trim().min(1, "Comment body cannot be empty"),
    }),
    params: z.object({
        postId: z.string().uuid(),
        parentId: z.string().uuid(),
    }),
    query: z.object({}).optional(),
});

export const getCommentsSchema = z.object({
    body: z.object({}).optional(),
    params: z.object({ postId: z.string().uuid() }),
    query: z.object({}).optional(),
});

export const getRepliesSchema = z.object({
    body: z.object({}).optional(),
    params: z.object({ parentId: z.string().uuid() }),
    query: z.object({}).optional(),
});