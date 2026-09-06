import { z } from "zod";


export const postIdSchema = z.object({
    params: z.object({
        postId: z.string().uuid({ message: "Invalid post ID format." })
    })
});


export const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params
            });
            next();
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.errors.map(err => err.message)
            });
        }
    };
};