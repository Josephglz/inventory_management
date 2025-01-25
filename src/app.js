import express from 'express';
import dotenv from 'dotenv';
import { runMigrations } from './utils/migrations.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.status(200).json({message: "API is running..."}));

runMigrations();

app.listen(PORT, () => console.log(`[SERVER]: Running on http://localhost:${PORT}`));