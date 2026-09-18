import { ZodError } from "zod";

const validate = (schema) => (req, res, next) => {
    try {
        const parsed = schema.parse({
            body: req.body,
            params: req.params,
            query: req.query
        });

        req.validated = {
            body: parsed.body,
            params: parsed.params,
            query: parsed.query
        };

        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                errors: error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))
            });
        }

        next(error);
    }
};

export default validate;