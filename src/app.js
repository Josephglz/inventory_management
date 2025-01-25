import express from 'express';
import dotenv from 'dotenv';

import { runMigrations } from './utils/migrations.js';
import productRoutes from './routes/productRoutes.js';


dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.status(200).json({message: "API is running..."}));
app.use('/api', productRoutes)

runMigrations();

app.listen(PORT, () => console.log(`[SERVER]: Running on http://localhost:${PORT}`));