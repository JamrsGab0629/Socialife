import { revokeTokenService } from "../../services/tokenBlocklisted.service.js";

export const logout = async (req, res) => {
    try {
        // Always clear the HTTP-only cookie to reset the client session
        res.clearCookie('access_token', { path: '/' });
        res.clearCookie('refresh_token', { path: '/' });

        return res.status(200).json({ success: true, message: "Logout succesfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.clearCookie("token");
        return res.status(500).json({ message: "Server error during logout." });
    }
};