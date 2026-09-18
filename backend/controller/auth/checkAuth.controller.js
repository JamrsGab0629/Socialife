import User from "../../model/user.model.js";

export const checkAuth = async (req, res) => {
    try {
        const userId = req.user.userId ?? req.user.user_id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID not found in token" });
        }

        const user = await User.findOne({where: { user_id: userId, is_actived: true }, attributes: [ "first_name", "last_name", "username", "email" ]});
        if(!user) throw new Error("User not found or is deactivated");

        return res.status(200).json({
            message: "Authentication succesful",
            success: true,
            user,
        })
    } catch (error) {
        const error_status = (error.message === "User not found or is deactivated") ? 404 : 500 ;
        return res.status(error_status).json({
            message: error.message,
            success: false,
        })
    }
}