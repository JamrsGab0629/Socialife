import { Op } from "sequelize";
import { Report, User } from "../model/association.model.js";
import { hybridLoad } from "../utils/loaders/hybrid.loader.js";

/**
 * Creates a new report against a specified user.
 */
export const createReportService = async (authorId, body) => {
    const { user_id, message } = body;

    // 1. Guard against self-reporting
    if (authorId === user_id) {
        throw new Error("You cannot report your own account");
    }

    // 2. Message content validation
    if (!message || !message.trim()) {
        throw new Error("Report message cannot be empty");
    }

    // 3. Verify target user exists and is active
    const reportedUser = await User.findOne({ 
        where: { user_id, is_active: true } 
    });
    if (!reportedUser) {
        throw new Error("Account not found");
    }

    // 4. Prevent duplicate pending reports from the same author
    const existingReport = await Report.findOne({
        where: {
            author_id: authorId,
            user_id,
            status: "PENDING"
        }
    });

    if (existingReport) {
        throw new Error("You already have an active pending report against this account");
    }

    // 5. Persist report record
    return await Report.create({
        author_id: authorId,
        user_id,
        message: message.trim(),
        status: "PENDING"
    });
};

/**
 * Fetches paginated reports submitted by a specific user.
 */
export const getReportsService = async (authorId, query = {}) => {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));

    return await hybridLoad(Report, {
        page,
        limit,
        where: { author_id: authorId },
        include: [
            {
                model: User,
                as: "reported_user",
                attributes: ["user_id", "username", "profile_url"]
            }
        ],
        order: [["created_at", "DESC"]]
    });
};

/**
 * Admin view: Fetches paginated reports filtered by status.
 */
export const getAllReportsService = async (status = "ALL", query = {}) => {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));

    const whereClause = {};
    if (status && status.toUpperCase() !== "ALL") {
        whereClause.status = status.toUpperCase();
    }

    return await hybridLoad(Report, {
        page,
        limit,
        where: whereClause,
        include: [
            {
                model: User,
                as: "author",
                attributes: ["user_id", "username", "profile_url"]
            },
            {
                model: User,
                as: "reported_user",
                attributes: ["user_id", "username", "profile_url"]
            }
        ],
        order: [["created_at", "DESC"]]
    });
};

/**
 * Admin action: Updates the status of a specific report.
 */
export const updateReportStatusService = async (reportId, payload = {}) => {
    const { status, severity, resolution } = payload;

    const validStatuses = ["PENDING", "REVIEWED", "RESOLVED", "DISMISSED"];
    const validSeverities = ["NONE", "LOW", "MEDIUM", "HIGH"];
    const validResolutions = [
        "NO_ACTION", 
        "WARNING_ISSUED", 
        "CONTENT_REMOVED", 
        "SUSPENDED", 
        "DEACTIVATED"
    ];

    // Build update dynamic payload
    const updates = {};

    if (status) {
        const formattedStatus = status.toUpperCase();
        if (!validStatuses.includes(formattedStatus)) {
            throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
        }
        updates.status = formattedStatus;
    }

    if (severity) {
        const formattedSeverity = severity.toUpperCase();
        if (!validSeverities.includes(formattedSeverity)) {
            throw new Error(`Invalid severity. Must be one of: ${validSeverities.join(", ")}`);
        }
        updates.severity = formattedSeverity;
    }

    if (resolution) {
        const formattedResolution = resolution.toUpperCase();
        if (!validResolutions.includes(formattedResolution)) {
            throw new Error(`Invalid resolution. Must be one of: ${validResolutions.join(", ")}`);
        }
        updates.resolution = formattedResolution;

        // Auto-resolve report if an explicit resolution action is selected
        if (!updates.status) {
            updates.status = "RESOLVED";
        }
    }

    // Execute atomic updates using a managed transaction
    return await sequelize.transaction(async (t) => {
        const report = await Report.findByPk(reportId, { transaction: t });
        if (!report) {
            throw new Error("Report not found");
        }

        // If resolution action is DEACTIVATED, deactivate the reported target user
        if (updates.resolution === "DEACTIVATED") {
            const targetUser = await User.findByPk(report.user_id, { transaction: t });
            if (targetUser && targetUser.is_active) {
                await targetUser.update({ is_active: false }, { transaction: t });
            }
        }

        // Apply report updates
        const updatedReport = await report.update(updates, { transaction: t });

        return updatedReport;
    });
};