import User from "../model/user.model.js";
import { hashPassword, comparePassword } from "../utils/passwordHashing.utils.js";

const errorHelper = (status, message) => {
    const error = new Error(message);
    error.status = status;
    throw error;
};

export const changePassword = async (userId, body) => {
    const { password, new_password } = body;

    const user = await User.findOne({
        where: {
            user_id: userId,
            is_actived: true,
        },
    });

    if (!user) {
        errorHelper(403, "User not found");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        errorHelper(401, "Password incorrect");
    }

    user.password = await hashPassword(new_password);
    await user.save();

    return {
        message: "Password changed successfully",
        success: true,
    };
};