import { z } from "zod";

export const notificationParamSchema = z.object({
    params: z.object({
        id: z.string().uuid({ message: "Invalid notification ID format" }),
    }),
});

export const notificationQuerySchema = z.object({
    query: z.object({
        page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
        limit: z.string().optional().transform(val => (val ? parseInt(val, 10) : 10)),
    }),
});