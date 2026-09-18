import { z } from "zod";

const paginationSchema = z.object({
    page: z.coerce
        .number()
        .int()
        .min(1)
        .default(1),

    limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .default(10),
});

export const createPostSchema = z.object({
    body: z.object({
        caption: z
            .string()
            .trim()
            .max(500, "Caption cannot exceed 500 characters")
            .optional(),

        content: z
            .string()
            .trim()
            .min(1, "Post content cannot be empty")
            .max(5000, "Post content cannot exceed 5000 characters"),
    }),

    params: z.object({}),
    query: z.object({}),
});

export const getHomeFeedSchema = z.object({
    body: z
        .object({})
        .optional()
        .default({}),

    params: z
        .object({})
        .optional()
        .default({}),

    query: paginationSchema,
});

export const getProfileFeedSchema = z.object({
    body: z
        .object({})
        .optional()
        .default({}),

    params: z.object({
        userId: z.string().uuid("Invalid user ID"),
    }),

    query: paginationSchema,
});

export const getPostByIdSchema = z.object({
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

export const deactivatePostSchema = z.object({
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