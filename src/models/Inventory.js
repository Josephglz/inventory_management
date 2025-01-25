import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  productId: {
    type: DataTypes.STRING,
    references: {
      model: 'products',
      key: 'id',
    },
  },
  storeId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  minStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'inventories',
  timestamps: false,
  indexes: [
    { fields: ['productId'] },
    { fields: ['storeId'] },
  ],
});

export default Inventory;
