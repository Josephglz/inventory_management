import express from 'express';
import { createInventory, getInventoryByStoreId, transferInventory, getLowStockProducts } from '../controllers/stockController.js';

const router = express.Router();

router.get('/stores/:id/inventory', getInventoryByStoreId);
router.get('/inventory/alerts', getLowStockProducts);

router.post('/stores/inventory', createInventory);
router.post('/inventory/transfer', transferInventory);

export default router;