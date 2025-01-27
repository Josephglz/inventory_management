import request from 'supertest';
import app from '../../src/app.js';
import { Product, Inventory } from '../../src/models/index.js';
import sequelize from '../../src/config/database.js';

describe('Test de integración para el flujo de productos e inventario', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('Crea un producto y su inventario', async () => {
        const productResponse = await request(app)
            .post('/api/products')
            .send({
                name: "Producto Integración",
                description: "Descripción del Producto Integración",
                category: "Categoría Integración",
                price: "99.99",
                sku: "SKUINTEGRATION1",
            })

        expect(productResponse.status).toBe(201);
        expect(productResponse.body.product).toHaveProperty('id');

        const productId = productResponse.body.product.id;

        const inventoryData = {
            productId: productId,
            storeId: 'store1',
            quantity: 10,
            minStock: 5
        };

        const inventoryResponse = await request(app)
            .post('/api/stores/inventory')
            .send(inventoryData);

        expect(inventoryResponse.status).toBe(201);
        expect(inventoryResponse.body.newInventory).toHaveProperty('id');

        const inventory = await Inventory.findOne({ where: { productId } });
        expect(inventory).not.toBeNull();
        expect(inventory.quantity).toBe(10);
    });
});