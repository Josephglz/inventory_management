import Product from "./Product.js";
import Inventory from "./Inventory.js";
import Movement from "./Movement.js";

Product.hasMany(Inventory, { foreignKey: "productId", as: "inventories" });
Inventory.belongsTo(Product, { foreignKey: "productId", as: "product" });

Product.hasMany(Movement, { foreignKey: "productId", as: "movements" });
Movement.belongsTo(Product, { foreignKey: "productId", as: "product" });

export { Product, Inventory, Movement };
