import express from 'express';
import dotenv from 'dotenv';

import { runMigrations } from './utils/migrations.js';
import productRoutes from './routes/productRoutes.js';
import stockRoutes from './routes/stockRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.status(200).json({message: "API is running..."}));
app.use('/api', productRoutes);
app.use('/api', stockRoutes);

runMigrations();

const startServer = (appInstance, port) => {
  appInstance.listen(port, () => console.log(`[SERVER]: Running on http://localhost:${port}`));
};

if (process.env.NODE_ENV !== 'test') {
  startServer(app, PORT);
}

export default app;