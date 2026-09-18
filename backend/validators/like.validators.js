// validators/like.validators.js

import { z } from "zod";

export const toggleLikeSchema = z.object({
    body: z
        .object({})
        .optional()
        .default({}),

    params: z.object({
        postId: z.string().uuid("Invalid post ID"),
    }),

    query: z
        .object({})
        .optional()
        .default({}),
});