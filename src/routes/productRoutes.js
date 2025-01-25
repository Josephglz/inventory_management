import express from 'express';
import { createProduct, getProducts, getProductById } from '../controllers/productController.js';

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:id', getProductById);

router.post('/products', createProduct);

export default router;