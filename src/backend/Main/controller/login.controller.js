import { loginService } from "../services/login.service.js";
import { setAuthCookie } from "../utils/cookie.utils.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                message: "Email and password are required." 
            });
        }
        
        const { user, token } = await loginService({ email, password });

        setAuthCookie(res, token);

        return res.status(200).json({
            message: "Login successful!",
            user
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};