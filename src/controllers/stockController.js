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
    const { productId, sourceStoreId, targetStoreId, quantity } = req.body

    if(!productId || !sourceStoreId || !targetStoreId || !quantity) return res.status(400).json({
        message: "Todos los campos son requeridos. Por favor intente nuevamente."
    });

    if(isNaN(quantity) || quantity <= 0) return res.status(400).json({
        message: "La cantidad introducida es inválida. Por favor intente nuevamente."
    });

    if(sourceStoreId === targetStoreId) return res.status(400).json({
        message: "Las tiendas de origen y destino no pueden ser iguales. Por favor intente nuevamente."
    });

    const t = await sequelize.transaction();

    try {
        const product = await Product.findByPk(productId);
        if(!product) return res.status(404).json({ message: `No se encontró el producto con el id ${productId}` });

        const sourceInventory = await Inventory.findOne({ 
            where: { productId, storeId: sourceStoreId }
        });

        if(!sourceInventory) return res.status(404).json({ message: `No se encontró inventario para el producto en la tienda de origen` });
        if(sourceInventory.quantity < quantity) return res.status(400).json({
            message: `La cantidad a transferir (${quantity}) excede la cantidad disponible en la tienda de origen (${sourceInventory.quantity}).`
        });

        let targetInventory = await Inventory.findOne({ 
            where: { productId, storeId: targetStoreId }
        });

        if(!targetInventory) {
            targetInventory = await Inventory.create({
                id: uuidv4(),
                productId,
                storeId: targetStoreId,
                quantity: 0,
                minStock: sourceInventory.minStock || 0
            }, { transaction: t });
        }

        await sourceInventory.update(
            {quantity: sourceInventory.quantity - quantity},
            {transaction: t}
        )

        await targetInventory.update(
            {quantity: targetInventory.quantity + quantity},
            {transaction: t}
        )

        const newMovement = await Movement.create({
            id: uuidv4(),
            productId,
            sourceStoreId,
            targetStoreId,
            quantity,
            timestamp: new Date(),
            type: "TRANSFER"
        }, { transaction: t });

        await t.commit();

        return res.status(201).json({
            message: "Inventario transferido correctamente",
            movement: newMovement,
            product,
        });

    } catch (error) {
        await t.rollback();
        console.error("[ERROR]: Error al transferir inventario ", error);
        return res.status(500).json({ message: "Error al transferir inventario" });
    }
}

const getLowStockProducts = async (req, res) => {
    try {
        const { storeId } = req.query;
        
        const filter = {
            quantity: {
                [Op.lt]: sequelize.col('minStock')
            }
        }
        
        if(storeId) filter.storeId = storeId;

        const lowStockInventories = await Inventory.findAll({
            where: filter,
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'category', 'price', 'sku']
            }],
            attributes: ['id', 'storeId', 'quantity', 'minStock']
        })

        if(lowStockInventories.length === 0) {
            return res.status(404).json({
                message: storeId ? 
                    `No se encontraron productos con stock bajo en la tienda ID:${storeId}` :
                    "No se encontraron productos con stock bajo"
            })
        }

        return res.status(200).json({
            message: storeId ? 
                `Productos con stock bajo en la tienda ID:${storeId} obtenidos correctamente` :
                "Productos con stock bajo obtenidos correctamente",
            lowStock: lowStockInventories
        });

    } catch (error) {
        console.error("[ERROR]: Error al obtener los productos con stock bajo ", error);
        return res.status(500).json({ message: "Error al obtener los productos con stock bajo" });
    }
}
export {
    getInventoryByStoreId,
    createInventory,
    transferInventory,
    getLowStockProducts
}