import User from "../model/user.model.js";

const state = async (req, res) => {
    try {
        const email = req.query?.email || req.body?.email;

        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        const user = await User.findOne({
            where: { email },
            attributes: ["is_actived", "is_verified", "is_completed"]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({
            message: "Successfully retrieved user state.",
            is_actived: user.is_actived,
            is_verified: user.is_verified,
            is_completed: user.is_completed
        });
    } catch (error) {
        console.error("Error in state handler:", error);
        return res.status(500).json({ message: "Server error while fetching user state." });
    }
};

export { state };