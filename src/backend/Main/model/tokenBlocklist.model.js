import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js"; 

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
    }
}, {
    timestamps: true
});

export default TokenBlocklist;