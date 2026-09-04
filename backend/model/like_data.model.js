import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.config.js";

class LikeData extends Model {}

LikeData.init({
    like_data_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    post_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: "LikeData",
    tableName: "like_data",
    timestamps: true,
    updatedAt: false,
    createdAt: 'created_at',
    indexes: [
        {
            unique: true,
            fields: ['post_id', 'user_id'] // Prevents duplicate likes by same user on same post
        }
    ]
});

export default LikeData;