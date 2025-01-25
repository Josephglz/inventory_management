import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database.js';

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    defaultValue: uuidv4(),
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
