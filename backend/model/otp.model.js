import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.config.js";

class Otp extends Model {}

Otp.init(
    {
        otp_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true, 
            references: {
                model: "users",
                key: "user_id"
            },
            onDelete: "CASCADE"
        },
        otp_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        otp_expires_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "Otp",
        tableName: "otps",
        timestamps: true
    }
);

export default Otp;