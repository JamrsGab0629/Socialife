import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.config.js";

class SharedPost extends Model {}

SharedPost.init(
  {
    share_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    post_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "posts",
        key: "post_id",
      },
    },
    caption: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "SharedPost",
    tableName: "shared_posts",
    timestamps: true,
    updatedAt: false,
    createdAt: 'created_at',
  }
);

export default SharedPost;