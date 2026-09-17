import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.config.js";

class Report extends Model { }

Report.init(
    {
        report_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        author_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("PENDING", "REVIEWED", "RESOLVED", "DISMISSED"),
            defaultValue: "PENDING",
            allowNull: false,
        },
        priority: {
            type: DataTypes.ENUM("NONE", "LOW", "MIDDLE", "HIGH"),
            defaultValue: "NONE",
            allowNull: false,
        },
        resolution: {
            type: DataTypes.ENUM(
                "NO_ACTION",      // Report dismissed or unsubstantiated
                "WARNING_ISSUED", // Sent warning to reported user
                "CONTENT_REMOVED",// Post/comment deleted
                "SUSPENDED",      // Temporary ban
                "DEACTIVATED"     // Permanent ban/deactivation
            ),
            defaultValue: "NO_ACTION",
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: "Report",
        tableName: "reports",
        timestamps: true,
        updatedAt: "updated_at",
        createdAt: "created_at",
    }
);

export default Report;