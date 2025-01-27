import request from "supertest";
import app from "../../src/app.js";
import { Inventory, Product, Movement } from "../../src/models/index.js";
import { v4 as uuidv4 } from "uuid";

jest.mock("../../src/models/index.js");

describe("StockController Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/stores/:id/inventory", () => {
    it("debería retornar el inventario de la tienda con un código 200", async () => {
      const mockInventory = [
        {
          id: uuidv4(),
          quantity: 10,
          minStock: 5,
          product: {
            id: uuidv4(),
            name: "Producto A",
            category: "Categoría 1",
            price: "100.50",
            sku: "SKU123",
          },
        },
      ];

      Inventory.findAll.mockResolvedValue(mockInventory);

      const response = await request(app).get("/api/stores/1/inventory").expect(200);

      expect(response.body).toEqual({
        message: "Inventario de la tienda obtenido correctamente",
        inventory: mockInventory,
      });
    });

    it("debería retornar un error 404 si no hay inventario", async () => {
      Inventory.findAll.mockResolvedValue([]);

      const response = await request(app).get("/api/stores/1/inventory").expect(404);

      expect(response.body).toEqual({
        message: "No se encontró inventario para la tienda indicada.",
      });
    });

    it("debería retornar un error 500 si ocurre un problema", async () => {
      Inventory.findAll.mockRejectedValue(new Error("Error en la base de datos"));

      const response = await request(app).get("/api/stores/1/inventory").expect(500);

      expect(response.body).toEqual({
        message: "Error al obtener el inventario de la tienda",
      });
    });
  });

  describe("POST /api/inventory/transfer", () => {
    it("debería retornar un error 404 si no se encuentra el producto", async () => {
      Product.findByPk.mockResolvedValue(null);
  
      const response = await request(app)
        .post("/api/inventory/transfer")
        .send({
          productId: uuidv4(),
          sourceStoreId: "1",
          targetStoreId: "2",
          quantity: 5,
        })
        .expect(404);
  
      expect(response.body).toEqual({
        message: expect.stringMatching(/No se encontró el producto con el id/),
      });
    });
  
    it("debería retornar un error 500 si ocurre un problema", async () => {
      Product.findByPk.mockRejectedValue(new Error("Error en la base de datos"));
  
      const response = await request(app)
        .post("/api/inventory/transfer")
        .send({
          productId: uuidv4(),
          sourceStoreId: "1",
          targetStoreId: "2",
          quantity: 5,
        })
        .expect(500);
  
      expect(response.body).toEqual({
        message: "Error al transferir inventario",
      });
    });
  });
  
  describe("GET /api/inventory/alerts", () => {
    it("debería listar productos con stock bajo con un código 200", async () => {
      const mockLowStock = [
        {
          id: uuidv4(),
          storeId: "1",
          quantity: 2,
          minStock: 5,
          product: {
            id: uuidv4(),
            name: "Producto B",
            category: "Categoría 2",
            price: "50.00",
            sku: "SKU456",
          },
        },
      ];

      Inventory.findAll.mockResolvedValue(mockLowStock);

      const response = await request(app).get("/api/inventory/alerts").expect(200);

      expect(response.body).toEqual({
        message: "Productos con stock bajo obtenidos correctamente",
        lowStock: mockLowStock,
      });
    });

    it("debería retornar un error 404 si no hay productos con stock bajo", async () => {
      Inventory.findAll.mockResolvedValue([]);

      const response = await request(app).get("/api/inventory/alerts").expect(404);

      expect(response.body).toEqual({
        message: "No se encontraron productos con stock bajo",
      });
    });

    it("debería retornar un error 500 si ocurre un problema", async () => {
      Inventory.findAll.mockRejectedValue(new Error("Error en la base de datos"));

      const response = await request(app).get("/api/inventory/alerts").expect(500);

      expect(response.body).toEqual({
        message: "Error al obtener los productos con stock bajo",
      });
    });
  });
});