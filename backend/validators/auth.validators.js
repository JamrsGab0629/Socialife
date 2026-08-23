import { z } from "zod";

export const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email address").endsWith("@gmail.com", "Email must end with @gmail.com"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    first_name: z.string().min(1, "First name is required"),
    middle_name: z.string().optional().nullable(),
    last_name: z.string().min(1, "Last name is required"),
    birth_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid birth date format",
    })
});