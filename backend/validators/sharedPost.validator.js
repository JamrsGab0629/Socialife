import { z } from "zod";

export const sharePostSchema = z.object({
    params: z.object({
        postId: z.string().uuid({ message: "Invalid post ID format." })
    }),
    body: z.object({
        caption: z.string().max(500, { message: "Caption cannot exceed 500 characters." }).optional(),
        mentions: z.array(z.string().uuid()).max(20).optional().default([])
    })
});