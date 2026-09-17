import { signup$ } from "../../validators/auth.validator.js";
import { signup } from "../../services/auth.service.js";

const signingup = async (req, res) => {
    try {
        const validated = signup$.parse(req.body);

        const result = await signup(validated);

        return res.status(200).json({
            message: "Signup succesfully. Ready for verification."
        })
    } catch (error) {
        if (error.name === "ZodError") {
            const errorMessages = error.errors.map(err => err.message).join(", ");
            return res.status(400).json({ message: errorMessages });
        }

        return res.status(400).json({
            message: error.message
        });
    }
}

export { signingup }