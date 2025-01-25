import express from 'express';
import { createProduct, getProducts, getProductById, updateProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:id', getProductById);

router.post('/products', createProduct);

router.put('/products/:id', updateProduct);

export default router;