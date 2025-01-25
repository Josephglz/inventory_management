import { v4 as uuidv4 } from 'uuid';
import { Op } from "sequelize";
import { validateValue } from '../utils/validations.js';

import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import Movement from '../models/Movement.js';
import sequelize from '../config/database.js';

const getInventoryByStoreId = async (req, res) => {
    try {
        const { id: storeId } = req.params;
        if(!storeId) return res.status(400).json({ message: "El id de la tienda es obligatorio" });

        const inventory = await Inventory.findAll({
            where: { storeId },
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'category', 'price', 'sku']
            }],
            attributes: ['id', 'quantity', 'minStock']
        })

        if(inventory.length === 0) {
            return res.status(404).json({ message: "No se encontró inventario para la tienda indicada." });
        }

        return res.status(200).json({
            message: "Inventario de la tienda obtenido correctamente",
            inventory
        });

    } catch (error) {
        console.error("[ERROR]: Error al obtener el inventario de la tienda ", error);
        return res.status(500).json({ message: "Error al obtener el inventario de la tienda" });
    }
}

const createInventory = async (req, res) => {
    const { productId, storeId, quantity, minStock } = req.body;

    if(!productId || !storeId || !quantity || !minStock) return res.status(400).json({
        message: "Todos los campos son requeridos. Por favor intente nuevamente."
    });

    if(isNaN(quantity) && isNaN(minStock) && quantity >= 0 && minStock >= 0) return res.status(400).json({
        message: "Los datos ingresados no son válidos. Por favor intente nuevamente."
    });

    const t = await sequelize.transaction();
    try {
        const product = await Product.findByPk(productId);
        if(!product) return res.status(404).json({ message: `No se encontró el producto con el id ${productId}` });

        const inventory = await Inventory.findOne({ where: { productId: productId, storeId } });
        if(inventory) return res.status(400).json({ message: "Ya existe un inventario para el producto en la tienda indicada." });

        const newInventory = await Inventory.create({
            id: uuidv4(),
            productId: productId,
            storeId,
            quantity,
            minStock
        }, { transaction: t });

        const newMovement = await Movement.create({
            id: uuidv4(),
            productId: productId,
            sourceStoreId: storeId,
            targetStoreId: storeId,
            quantity,
            timestamp: new Date(),
            type: "IN"
        }, { transaction: t });

        await t.commit();
        return res.status(201).json({
            message: "Inventario creado correctamente",
            newInventory,
            newMovement
        });

    } catch (error) {
        await t.rollback();
        console.error("[ERROR]: Error al crear el inventario ", error);
        return res.status(500).json({ message: "Error al crear el inventario" });
    }
}

const transferInventory = async (req, res) => {
}

export {
    getInventoryByStoreId,
    createInventory,
    transferInventory,
}