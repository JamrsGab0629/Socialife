import * as getAllDataService from "../../services/getAllData.admin.js";

export const getAllData = async (req, res) => {
    try {
        const data = await getAllDataService.getAllData();
        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: {
                totalBannedUsers: -1,
                totalPosts: -1,
                totalUsers: -1,
                totalPendingReports: -1,
            },
        });
    }
};