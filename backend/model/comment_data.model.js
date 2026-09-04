import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.config";

class CommentData extends Model {};

CommentData.init({
    comment_data_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    post_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    author_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    comment: {
        type: DataTypes.STRING(100),
        allowNull: false,
    }
},{
    sequelize,
    modelName: "CommentData",
    tableName: "comment_data",
    timestamps: true,
    updatedAt: false,
    createdAt: 'created_at',
})