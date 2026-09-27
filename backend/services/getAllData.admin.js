import { User, Post, Report } from "../model/association.model.js";

export const getAllData = async () => {
    const [totalBannedUsers, totalPosts, totalUsers, totalPendingReports] =
        await Promise.all([
            User.count({ where: { is_actived: false } }).catch(() => -1),

            // Total posts
            Post.count().catch(() => -1),

            // Total users count
            User.count().catch(() => -1),

            // Total pending reports (status = "PENDING")
            Report.count({ where: { status: "PENDING" } }).catch(() => -1),
        ]);

    return {
        totalBannedUsers,
        totalPosts,
        totalUsers,
        totalPendingReports,
    };
};