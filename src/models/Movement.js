import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database.js';

const Movement = sequelize.define('Movement', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    defaultValue: uuidv4(),
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
  indexes: [
    { fields: ['productId'] },
    { fields: ['sourceStoreId'] },
    { fields: ['targetStoreId'] },
  ],
});

export default Movement;