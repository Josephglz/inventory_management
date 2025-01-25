import express from 'express';
import { createInventory, getInventoryByStoreId } from '../controllers/stockController.js';

const router = express.Router();

router.get('/stores/:id/inventory', getInventoryByStoreId);

router.post('/stores/inventory', createInventory);

export default router;