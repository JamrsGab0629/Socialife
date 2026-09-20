import { loginService } from "../../services/login.service.js";
import { login$ } from "../../validators/auth.validator.js";
import { setAccessTokenCookie, setRefreshTokenCookie } from "../../utils/cookie.utils.js";

export const login = async (req, res) => {
    try {
        const validatedData = login$.parse(req.body);

        const { user, refreshToken, accessToken } = await loginService(validatedData);

        setAccessTokenCookie(res, accessToken);
        setRefreshTokenCookie(res, refreshToken);

        return res.status(200).json({
            message: "Login successful!",
            user
        });

    } catch (error) {
        if (error.name === "ZodError") {
            // Changed error.errors to error.issues
            const errorMessages = error.issues.map(err => err.message).join(", ");
            return res.status(400).json({ message: errorMessages });
        }

        return res.status(400).json({
            message: error.message
        });
    }
};