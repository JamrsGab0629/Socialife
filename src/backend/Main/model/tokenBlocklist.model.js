import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js"; 
import User from "./user.model.js";

const TokenBlocklist = sequelize.define("TokenBlocklist", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    jti: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: User,
            key: "user_id"
        }
    }
}, {
    timestamps: true
});

// Establish the relationship
User.hasMany(TokenBlocklist, { foreignKey: "user_id", onDelete: "CASCADE" });
TokenBlocklist.belongsTo(User, { foreignKey: "user_id" });

export default TokenBlocklist;