import { query } from '../config/db';

const addStockToProducts = async () => {
    try {
        // 1. Add column if not exists
        await query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 5;
    `);

        // 2. Update existing records to 5 (optional if default handles it for new ones, but good for existing)
        await query(`
      UPDATE products SET stock_quantity = 5 WHERE stock_quantity IS NULL;
    `);

        console.log('Successfully added stock_quantity to products table and set default to 5.');
    } catch (error) {
        console.error('Error altering products table:', error);
    } finally {
        process.exit();
    }
};

addStockToProducts();
