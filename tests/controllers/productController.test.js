import request from "supertest";
import app from "../../src/app.js";
import { Product, Inventory } from "../../src/models/index.js";
import { v4 as uuidv4 } from "uuid";

jest.mock("../../src/models/index.js");

describe("ProductController Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/products", () => {
    it("Deberá retornar la lista de productos con un código 200", async () => {
      const mockProducts = [
        {
          id: uuidv4(),
          name: "Producto A",
          category: "Categoría 1",
          price: "100.50",
          sku: "SKU123",
          inventories: [{ storeId: "1", quantity: 10, minStock: 5 }],
        },
      ];

      Product.findAndCountAll.mockResolvedValue({ rows: mockProducts, count: 1 });

      const response = await request(app).get("/api/products").expect(200);

      expect(response.body).toEqual({
        message: "Lista de productos obtenida exitosamente",
        products: mockProducts,
        total: 1,
        page: 1,
        totalPages: 1,
      });
    });

    it("Debería retornar un error 500 si hay un error en la base de datos", async () => {
      Product.findAndCountAll.mockRejectedValue(new Error("Error en la base de datos"));

      const response = await request(app).get("/api/products").expect(500);

      expect(response.body).toEqual({
        message: "Error al obtener los productos",
        error: "Error en la base de datos",
      });
    });
  });

  describe("GET /api/products/:id", () => {
    it("Debería retornar el producto especificado con un código 200", async () => {
      const mockProduct = {
        id: uuidv4(),
        name: "Producto A",
        category: "Categoría 1",
        price: "100.50",
        sku: "SKU123",
        inventories: [{ storeId: "1", quantity: 10, minStock: 5 }],
      };

      Product.findByPk.mockResolvedValue(mockProduct);

      const response = await request(app)
        .get(`/api/products/${mockProduct.id}`)
        .expect(200);

      expect(response.body).toEqual({
        message: "Producto obtenido exitosamente.",
        product: mockProduct,
      });
    });

    it("debería retornar un error 404 si el producto no existe", async () => {
      Product.findByPk.mockResolvedValue(null);

      const fakeId = uuidv4();
      const response = await request(app).get(`/api/products/${fakeId}`).expect(404);

      expect(response.body).toEqual({
        message: `Producto con ID: ${fakeId} no encontrado.`,
      });
    });
  });

  describe("POST /api/products", () => {
    it("Debería crear un producto y retornar un código 201", async () => {
      const mockRequest = {
        name: "Producto A",
        description: "Descripción del Producto A",
        category: "Categoría 1",
        price: "100.50",
        sku: "SKU123",
      };

      const mockNewProduct = { ...mockRequest, id: uuidv4() };

      Product.create.mockResolvedValue(mockNewProduct);
      Product.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/products")
        .send(mockRequest)
        .expect(201);

      expect(response.body).toEqual({
        message: "Producto creado exitosamente.",
        product: mockNewProduct,
      });
    });

    it("Debería retornar un error 400 si el SKU del producto ya existe", async () => {
      Product.findOne.mockResolvedValue({ id: uuidv4(), sku: "SKU123" });

      const mockRequest = {
        name: "Producto A",
        description: "Descripción del Producto A",
        category: "Categoría 1",
        price: "100.50",
        sku: "SKU123",
      };

      const response = await request(app)
        .post("/api/products")
        .send(mockRequest)
        .expect(400);

      expect(response.body).toEqual({
        message: "El producto con SKU: SKU123 ya existe.",
      });
    });
  });

  describe("PUT /api/products/:id", () => {
    it("Debería actualizar un producto y retornar un código 200", async () => {
      const mockProductId = uuidv4();
      const mockRequest = {
        name: "Producto Actualizado",
        description: "Descripción Actualizada",
        category: "Categoría Actualizada",
        price: "150.00",
        sku: "SKU1234",
      };

      const mockUpdatedProduct = { id: mockProductId, ...mockRequest };

      Product.findByPk.mockResolvedValue({ 
        ...mockUpdatedProduct, 
        update: jest.fn().mockResolvedValue(mockUpdatedProduct) 
      });
      Product.findOne.mockResolvedValue(null);

      const response = await request(app)
        .put(`/api/products/${mockProductId}`)
        .send(mockRequest)
        .expect(200);

      expect(response.body).toEqual({
        message: "Producto actualizado exitosamente.",
        product: mockUpdatedProduct,
      });
    });

    it("Debería retornar un error 404 si el producto no existe", async () => {
      Product.findByPk.mockResolvedValue(null);

      const mockProductId = uuidv4();
      const mockRequest = {
        name: "Producto Actualizado",
        description: "Descripción Actualizada",
        category: "Categoría Actualizada",
        price: "150.00",
        sku: "SKU1234",
      };

      const response = await request(app)
        .put(`/api/products/${mockProductId}`)
        .send(mockRequest)
        .expect(404);

      expect(response.body).toEqual({
        message: `Producto con ID: ${mockProductId} no encontrado.`,
      });
    });
  });

  describe("DELETE /api/products/:id", () => {
    it("Debería eliminar un producto y retornar un código 200", async () => {
      const mockProductId = uuidv4();

      Product.findByPk.mockResolvedValue({ 
        id: mockProductId, 
        destroy: jest.fn().mockResolvedValue(true) 
      });

      const response = await request(app)
        .delete(`/api/products/${mockProductId}`)
        .expect(200);

      expect(response.body).toEqual({
        message: "Producto eliminado exitosamente.",
      });
    });

    it("Debería retornar un error 404 si el producto no existe", async () => {
      Product.findByPk.mockResolvedValue(null);

      const mockProductId = uuidv4();

      const response = await request(app)
        .delete(`/api/products/${mockProductId}`)
        .expect(404);

      expect(response.body).toEqual({
        message: `Producto con ID: ${mockProductId} no encontrado.`,
      });
    });
  });
});
