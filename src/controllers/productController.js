import { v4 as uuidv4 } from 'uuid';

import Product from '../models/Product.js';
import sequelize from '../config/database.js';

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
        console.error('[SERVER]: Error al crear el producto: ', error);
        return res.status(500).json({ message: 'Error al crear el producto. Por favor intente nuevamente.' });
    }
}

export {
    createProduct
}