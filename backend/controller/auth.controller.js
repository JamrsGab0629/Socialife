import { registerUser } from "../services/auth.service.js";
import { registerSchema } from "../validators/auth.validators.js";

const register = async (req, res) => {
    try {
        // console.log("req", req.body)
        // 1. Validate request body using Zod
        // const validatedData = registerSchema.parse(req.body);
        const body = req.body

        // 2. Send clean data to service
        const result = await registerUser({...body});

        return res.status(200).json({
            message: result.message
        });

    } catch (error) {
       
        if (error.name === "ZodError") {
            const errorMessages = error.errors.map(err => err.message).join(", ");
            return res.status(400).json({ message: errorMessages });
        }

        return res.status(400).json({
            message: error.message
        });
    }
};

export { register };