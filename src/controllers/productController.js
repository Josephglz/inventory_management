import { v4 as uuidv4 } from 'uuid';
import { Op } from "sequelize";

import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import sequelize from '../config/database.js';

export const getProducts = async (req, res) => {
    try {
      const {
        category,
        minPrice,
        maxPrice,
        minStock,
        maxStock,
        page = 1,
        limit = 10,
      } = req.query;
  
      const offset = (page - 1) * limit;
  
      const filters = {};
      if (category) {
        filters.category = category.replace(/-/g, " ");
      }
      if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) filters.price[Op.gte] = parseFloat(minPrice);
        if (maxPrice) filters.price[Op.lte] = parseFloat(maxPrice);
      }
  
      const inventoryFilter =
        minStock || maxStock
          ? {
              quantity: {
                ...(minStock && { [Op.gte]: parseInt(minStock) }),
                ...(maxStock && { [Op.lte]: parseInt(maxStock) }),
              },
            }
          : undefined;
  
      const products = await Product.findAndCountAll({
        where: filters,
        include: [
          {
            model: Inventory,
            as: "inventories",
            attributes: ["storeId", "quantity", "minStock"],
            ...(inventoryFilter && { where: inventoryFilter }),
          },
        ],
        ...(limit && { limit: parseInt(limit) }),
        ...(offset && { offset: parseInt(offset) }),
      });
  
      res.status(200).json({
        message: "Lista de productos obtenida exitosamente",
        products: products.rows,
        total: products.count,
        ...(limit && {
          page: parseInt(page),
          totalPages: Math.ceil(products.count / limit),
        }),
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Error al obtener los productos", error: error.message });
    }
  };

const createProduct = async (req, res) => {
    const { name, description, category, price, sku } = req.body;

    if (!name || !description || !category || !price || !sku) {
        return res.status(400).json({ message: 'Todos los campos son requeridos. Por favor intente nuevamente.' });
    }

    const transaction = await sequelize.transaction();

    try {
        const newProduct = await Product.create({
            id: uuidv4(),
            name,
            description,
            category,
            price,
            sku
        }, { transaction });

        await transaction.commit();

        return res.status(201).json({
            message: 'Producto creado exitosamente.',
            product: newProduct
        });

    } catch (error) {
        await transaction.rollback();
        console.error('[SERVER]: Error al crear el producto: ', error.message);
        return res.status(500).json({ message: 'Error al crear el producto. Por favor intente nuevamente.' });
    }
}

export {
    createProduct
}