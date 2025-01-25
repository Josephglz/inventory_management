import sequelize from '../config/database.js';
import { Product, Inventory, Movement } from '../models/index.js';

async function runMigrations() {
  try {
    await sequelize.sync({ force: true });
    console.log('[DATABASE]: Migrations executed successfully');
  } catch (error) {
    console.error('[DATABASE]: Error while running migrations: ', error);
  }
}

export { runMigrations };