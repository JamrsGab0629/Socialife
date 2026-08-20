import { registerUser } from "../services/auth.service.js";

const register = async (req, res) => {
    try {
        const {
            username, email, password, first_name, middle_name, last_name, birth_date
        } = req.body;

        if (!username || !email || !password || !first_name || !last_name || !birth_date) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        const result = await registerUser({
            username, email, password, first_name, middle_name, last_name, birth_date
        });

       
        return res.status(200).json({
            message: result.message
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

export { register };