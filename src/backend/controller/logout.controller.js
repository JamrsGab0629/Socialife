import { revokeTokenService } from "../services/tokenBlocklisted.service.js";

export const logout = async (req, res) => {
    try {
        const token = req.cookies?.token;

        // Delegate business logic and database operations to the service
        const result = await revokeTokenService(token);

        // Always clear the HTTP-only cookie to reset the client session
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        // If the service indicates it wasn't a fresh logout (already logged out or no token)
        if (!result.success) {
            return res.status(400).json({ message: "Your account is already logged out." });
        }

        return res.status(200).json({ message: result.message });
    } catch (error) {
        console.error("Logout error:", error);
        res.clearCookie("token");
        return res.status(500).json({ message: "Server error during logout." });
    }
};