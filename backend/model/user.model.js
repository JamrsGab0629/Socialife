import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.config.js";

class User extends Model {}

User.init(
  {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
      allowNull: false,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    first_name: {
      type: DataTypes.STRING,
      defaultValue: "first",
      allowNull: false,
    },

    last_name: {
      type: DataTypes.STRING,
      defaultValue: "last",
      allowNull: false,
    },

    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    profile_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    friend_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },

    is_actived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },  
      cover_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    is_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    profile_picture_post_id: {
  type: DataTypes.UUID,
  allowNull: true,
},

cover_photo_post_id: {
  type: DataTypes.UUID,
  allowNull: true,
},
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    updatedAt: false,       
    createdAt: 'created_at',  
  },
);

export default User;