import { registerUser } from "../services/auth.service.js";
import { setAuthCookie } from "../utils/cookie.utils.js";

const register = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            first_name,
            middle_name,
            last_name,
            birth_date
        } = req.body;

        // Basic request validation
        if (
            !username ||
            !email ||
            !password ||
            !first_name ||
            !last_name ||
            !birth_date
        ) {
            return res.status(400).json({
                message: "Required fields are missing"
            });
        }

        const { user, token } = await registerUser({
            username,
            email,
            password,
            first_name,
            middle_name,
            last_name,
            birth_date
        });

        setAuthCookie(res, token);

        return res.status(201).json({
            message: "Account created successfully",
            user
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

export {
    register
};