import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.config.js";

class PhotoData extends Model {}

PhotoData.init(
  {
    photo_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.UUID,
      allowNull: true, 
    },
    href: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "PhotoData",
    tableName: "photo_data",
    timestamps: true,
    updatedAt: false,
    createdAt: 'created_at',
  }
);

export default PhotoData;