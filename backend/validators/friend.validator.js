import { z } from "zod";

export const friendParamSchema = z.object({
    params: z.object({
        userId: z.string().uuid({ message: "Invalid user ID format" }),
    }),
});