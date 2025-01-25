import sequelize from '../config/database.js';
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import Movement from '../models/Movement.js';

async function runMigrations() {
  try {
    await sequelize.sync({ force: true });
    console.log('[DATABASE]: Migrations executed successfully');
  } catch (error) {
    console.error('[DATABASE]: Error while running migrations: ', error);
  }
}

export { runMigrations };