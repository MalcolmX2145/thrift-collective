import { query } from '../config/db';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    sub_category: string; // Database column name
    sizes: string[];
    condition: string;
    brand?: string;
    is_sold: boolean;
    is_new: boolean;
    is_trending: boolean;
    is_premium: boolean;
    is_deal: boolean;
    measurements?: Record<string, string>;
    stock_quantity: number;
    created_at: Date;
}

export const findAllProducts = async (): Promise<Product[]> => {
    const result = await query('SELECT * FROM products ORDER BY created_at DESC');
    return result.rows;
};

export const findProductById = async (id: string): Promise<Product | null> => {
    const result = await query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0] || null;
};

export const updateProductStock = async (id: string, quantityBought: number) => {
    // Decrement stock
    await query('UPDATE products SET stock_quantity = GREATEST(0, stock_quantity - $1) WHERE id = $2', [quantityBought, id]);

    // Check if stock hits 0, if so, mark as sold
    const check = await query('SELECT stock_quantity FROM products WHERE id = $1', [id]);
    if (check.rows[0]?.stock_quantity === 0) {
        await query('UPDATE products SET is_sold = TRUE WHERE id = $1', [id]);
    }
};
