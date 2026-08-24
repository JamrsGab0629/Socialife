import z from "zod";

const email = z.string()
    .trim()
    .max(100, 'Email must be at most 100 characters')
    .email('Invalid email format')
    .transform((v) => v.toLocaleLowerCase())
    .refine(
        (val) => val.endsWith('@gmail.com'),
        { message: 'Email must have a suffix of @gmail.com' }
    );

const password = z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters')
    .regex(/[A-Za-z]/, 'Password must contain a letter')
    .regex(/[\d]/, 'Password must contain a number');

const name = z.string()
    .trim()
    .min(1, "Name cannot be empty")
    .max(50, "Must be less than 50 characters");

const birthday_format = z.string()
    .trim()
    .regex(/^\d{4}(?:\s|-)\d{2}(?:\s|-)\d{2}$/, "Date format must be YYYY-MM-DD or YYYY MM DD");

export const login$ = z.object({
    email: email,
    password: password,
}).strict();

export const signup$ = z.object({
    username: z.string().trim().min(8, "Username must be at least 8").max(20, "Must be less than 20 characters").regex(/[A_Za-z\d\_\-]/, "Must only contain Alphanumeric and _ -"),
    email: email,
    password: password,
}).strict();

export const otp$ = z.object({
    otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
}).strict();

export const register$ = z.object({
    firstname: name.regex(/^[A-Za-z\s]+$/, "Must only include characters and spaces"),
    middlename: name.regex(/^(?!\.)(?!.*\.\.)[A-Za-z\s.]+[A-Za-z.]$/, "Must contain only characters, spaces, or end with a dot (.)").optional(),
    lastname: name.regex(/^[A-Za-z]+$/, "Must only include characters"),
    birthday: birthday_format,
    address: z.string().trim().min(10, "Address must be at least 10 characters").max(100, "Address must be at most 100 characters"),
}).strict();