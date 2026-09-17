import * as reportService from "../../services/report.services.js";

export const addReport = async (req, res) => {
    try {
        const authorId = req.user?.userId ?? req.user?.user_id;
        if (!authorId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID not found in token" });
        }

        const result = await reportService.createReportService(authorId, req.body);

        return res.status(201).json({
            success: true,
            message: "Successfully created a report",
            data: result
        });
    } catch (error) {
        console.error("Error creating report:", error);

        // Map known client validation errors to proper HTTP statuses
        const badRequestMessages = [
            "You cannot report your own account",
            "Report message cannot be empty",
            "You already have an active pending report against this account"
        ];

        let statusCode = 500;
        if (error.message === "Account not found") {
            statusCode = 404;
        } else if (badRequestMessages.includes(error.message)) {
            statusCode = 400;
        }

        return res.status(statusCode).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

export const getReports = async (req, res) => {
    try {
        const authorId = req.user?.userId ?? req.user?.user_id;
        if (!authorId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID not found in token" });
        }

        const result = await reportService.getReportsService(authorId, req.query);

        return res.status(200).json({
            success: true,
            message: "Successfully fetched user reports",
            data: result
        });
    } catch (error) {
        console.error("Error fetching user reports:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

export const getAllReports = async (req, res) => {
    try {
        const status = req.params.status || "ALL";

        const result = await reportService.getAllReportsService(status, req.query);

        return res.status(200).json({
            success: true,
            message: "Successfully fetched all reports",
            data: result
        });
    } catch (error) {
        console.error("Error fetching admin reports:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// PUT /api/admin/reports/:reportId/update
export const updateReportStatus = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { status, severity, resolution } = req.body;

        if (!status && !severity && !resolution) {
            return res.status(400).json({ 
                success: false, 
                message: "At least one field (status, severity, resolution) must be provided for update" 
            });
        }

        const result = await reportService.updateReportStatusService(reportId, {
            status,
            severity,
            resolution
        });

        return res.status(200).json({
            success: true,
            message: "Successfully updated report details",
            data: result
        });
    } catch (error) {
        console.error("Error updating report status:", error);

        const badRequestPrefixes = ["Invalid status", "Invalid severity", "Invalid resolution"];
        const isBadRequest = badRequestPrefixes.some(prefix => error.message.startsWith(prefix));

        let statusCode = 500;
        if (error.message === "Report not found") {
            statusCode = 404;
        } else if (isBadRequest) {
            statusCode = 400;
        }

        return res.status(statusCode).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};