import User from "../model/user.model.js";


export const getDashboard = (req, res) => {
    return res.status(200).json({
        message: "Welcome to the Admin Dashboard!",
        admin_info: req.user 
    });
};

// Logic to get all registered users from the database
export const getAllUsers = async (req, res) => {
    try {
        // kukuhain lahat ng password pero exclusive
        const users = await User.findAll({
            attributes: { exclude: ['password'] } 
        });

        return res.status(200).json({
            message: "Successfully retrieved all users.",
            total_users: users.length,
            users: users
        });
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        return res.status(500).json({ message: "Server error while fetching users." });
    }
};