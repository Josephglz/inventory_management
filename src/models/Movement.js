import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Movement = sequelize.define('Movement', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sourceStoreId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetStoreId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('IN', 'OUT', 'TRANSFER'),
    allowNull: false,
  },
}, {
  tableName: 'movements',
  timestamps: false,
});

export default Movement;