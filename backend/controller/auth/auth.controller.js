import { registerService } from "../../services/register.service.js";
import { register$ } from "../../validators/auth.validator.js";

const register = async (req, res) => {
    try {
        // console.log("req", req.body)
        // 1. Validate request body using Zod
        const validatedData = register$.parse(req.body);

        // 2. Send clean data to service
        const result = await registerService(validatedData);

        return res.status(200).json({
            message: "registration complete. Ready for deployment"
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