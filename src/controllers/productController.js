import { v4 as uuidv4 } from 'uuid';
import { Op } from "sequelize";

import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import sequelize from '../config/database.js';
import { validateValue } from '../utils/validations.js';

const getProducts = async (req, res) => {
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
            if(minPrice && !validateValue(minPrice, 1, 10, true)) {
                return res.status(400).json({ message: 'El valor mínimo no es válido. Por favor intente nuevamente.' });
            } else if(maxPrice && !validateValue(maxPrice, 1, 10, true)) {
                return res.status(400).json({ message: 'El valor máximo no es válido. Por favor intente nuevamente.' });
            } else if(minPrice && parseFloat(minPrice) < 0) {
                return res.status(400).json({ message: 'El valor mínimo no puede ser negativo. Por favor intente nuevamente.' });
            } else if(maxPrice && minPrice && parseFloat(maxPrice) < parseFloat(minPrice)) {
                return res.status(400).json({ message: 'El valor máximo no puede ser menor al mínimo. Por favor intente nuevamente.' });
            }
            
            filters.price = {};
            if (minPrice) filters.price[Op.gte] = parseFloat(minPrice);
            if (maxPrice) filters.price[Op.lte] = parseFloat(maxPrice);
        }

        if(minStock && !validateValue(minStock, 1, 10, true)) {
            return res.status(400).json({ message: 'El stock mínimo no es válido. Por favor intente nuevamente.' });
        } else if(maxStock && !validateValue(maxStock, 1, 10, true)) {
            return res.status(400).json({ message: 'El stock máximo no es válido. Por favor intente nuevamente.' });
        } else if(minStock && parseInt(minStock) < 0) {
            return res.status(400).json({ message: 'El stock mínimo no puede ser negativo. Por favor intente nuevamente.' });
        } else if(maxStock && minStock && parseInt(maxStock) < parseInt(minStock)) {
            return res.status(400).json({ message: 'El stock máximo no puede ser menor al mínimo. Por favor intente nuevamente.' });
        }

        if(page && !validateValue(page, 1, 10, true)) {
            return res.status(400).json({ message: 'El número de página no es válido. Por favor intente nuevamente.' });
        }
        if(page && parseInt(page) < 1) {
            return res.status(400).json({ message: 'El número de página no puede ser menor a 1. Por favor intente nuevamente.' });
        }
        if(limit && !validateValue(limit, 1, 10, true)) {
            return res.status(400).json({ message: 'El límite de productos no es válido. Por favor intente nuevamente.' });
        }
        if(limit && parseInt(limit) < 1) {
            return res.status(400).json({ message: 'El límite de productos no puede ser menor a 1. Por favor intente nuevamente.' });
        }

        const inventoryFilter =
            minStock || maxStock ? {
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

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'El ID del producto es requerido. Por favor intente nuevamente.' });
        }

        const product = await Product.findByPk(id, {
            include: [
                {
                    model: Inventory,
                    as: "inventories",
                    attributes: ["storeId", "quantity", "minStock"],
                },
            ],
        });

        if (!product) {
            return res.status(404).json({ message: `Producto con ID: ${id} no encontrado.` });
        }

        res.status(200).json({
            message: 'Producto obtenido exitosamente.',
            product
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error al obtener el producto", error: error.message });
    }
}

const createProduct = async (req, res) => {
    const { name, description, category, price, sku } = req.body;

    if (!name || !description || !category || !price || !sku) {
        return res.status(400).json({ message: 'Todos los campos son requeridos. Por favor intente nuevamente.' });
    }

    if(!validateValue(name) || !validateValue(description) || !validateValue(category) || !validateValue(price, 1, 10, true) || !validateValue(sku, 3)) {
        return res.status(400).json({ message: 'Los datos ingresados no son válidos. Por favor intente nuevamente.' });
    }

    const transaction = await sequelize.transaction();

    try {
        const productExists = await Product.findOne({ where: { sku } });

        if (productExists) {
            return res.status(400).json({ message: `El producto con SKU: ${sku} ya existe.` });
        }

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
    getProducts,
    getProductById,
    createProduct
}