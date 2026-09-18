import { z } from "zod";

export const postIdSchema = z.object({
    params: z.object({
        postId: z.string().uuid({ message: "Invalid post ID format." })
    })
});

export const paginationSchema = z.object({
    query: z.object({
        page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
        limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10)
    })
});