import { revokeTokenService } from "../services/tokenBlocklisted.service.js";

export const logout = async (req, res) => {
    try {
        const token = req.cookies.token;

        // Delegate business logic and database operations to the service
        await revokeTokenService(token);

        // Clear the HTTP-only cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        return res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Server error during logout." });
    }
};