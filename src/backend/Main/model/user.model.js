import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.config.js";

class User extends Model {}

User.init(
    {
        user_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        role: {
            type: DataTypes.ENUM("user", "admin"),
            defaultValue: "user",
            allowNull: false
        },

        auth: {
            type: DataTypes.STRING,
            allowNull: false
        },

        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        middle_name: {
            type: DataTypes.STRING,
            allowNull: true
        },

        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        birth_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        }
    },
    {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: true
    }
);

export default User;