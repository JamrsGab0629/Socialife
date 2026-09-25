import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js"; // Adjust to your db config path

const Notification = sequelize.define("Notification", {
        post_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    notification_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    author_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: "notifications",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
});

export default Notification;