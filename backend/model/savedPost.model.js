import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.config.js";

class SavedPost extends Model {}

SavedPost.init(
  {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    post_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "SavedPost",
    tableName: "saved_posts",
    timestamps: true,
    updatedAt: false,
    createdAt: 'created_at',
  }
);

export default SavedPost;