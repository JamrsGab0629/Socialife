import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Friendship = sequelize.define('Friendship', {
  friendship_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  requester_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id',
    },
  },
  addressee_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id',
    },
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'declined'), // Adjust values to match your DB enum type
    allowNull: false,
    defaultValue: 'pending',
  },
}, {
  tableName: 'friendships',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Friendship;