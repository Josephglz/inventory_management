import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from 'uuid';
import sequelize from "../config/database.js";

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: uuidv4(),
        unique:true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'products',
    timestamps: false,
    indexes: [
        { fields: ['category'] },
        { fields: ['sku'] }
    ]
})

export default Product;