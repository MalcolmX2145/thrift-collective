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

export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
    const sql = `
        INSERT INTO products (
            name, description, price, images, category, sub_category,
            sizes, condition, brand, is_sold, is_new, is_trending,
            is_premium, is_deal, measurements, stock_quantity
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *
    `;

    const result = await query(sql, [
        productData.name,
        productData.description,
        productData.price,
        productData.images || [],
        productData.category,
        productData.sub_category,
        productData.sizes || [],
        productData.condition,
        productData.brand || null,
        productData.is_sold || false,
        productData.is_new || false,
        productData.is_trending || false,
        productData.is_premium || false,
        productData.is_deal || false,
        productData.measurements || null,
        productData.stock_quantity || 1
    ]);

    return result.rows[0];
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product | null> => {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Build dynamic UPDATE query based on provided fields
    if (productData.name !== undefined) {
        fields.push(`name = $${paramCount++}`);
        values.push(productData.name);
    }
    if (productData.description !== undefined) {
        fields.push(`description = $${paramCount++}`);
        values.push(productData.description);
    }
    if (productData.price !== undefined) {
        fields.push(`price = $${paramCount++}`);
        values.push(productData.price);
    }
    if (productData.images !== undefined) {
        fields.push(`images = $${paramCount++}`);
        values.push(productData.images);
    }
    if (productData.category !== undefined) {
        fields.push(`category = $${paramCount++}`);
        values.push(productData.category);
    }
    if (productData.sub_category !== undefined) {
        fields.push(`sub_category = $${paramCount++}`);
        values.push(productData.sub_category);
    }
    if (productData.sizes !== undefined) {
        fields.push(`sizes = $${paramCount++}`);
        values.push(productData.sizes);
    }
    if (productData.condition !== undefined) {
        fields.push(`condition = $${paramCount++}`);
        values.push(productData.condition);
    }
    if (productData.brand !== undefined) {
        fields.push(`brand = $${paramCount++}`);
        values.push(productData.brand);
    }
    if (productData.is_sold !== undefined) {
        fields.push(`is_sold = $${paramCount++}`);
        values.push(productData.is_sold);
    }
    if (productData.is_new !== undefined) {
        fields.push(`is_new = $${paramCount++}`);
        values.push(productData.is_new);
    }
    if (productData.is_trending !== undefined) {
        fields.push(`is_trending = $${paramCount++}`);
        values.push(productData.is_trending);
    }
    if (productData.is_premium !== undefined) {
        fields.push(`is_premium = $${paramCount++}`);
        values.push(productData.is_premium);
    }
    if (productData.is_deal !== undefined) {
        fields.push(`is_deal = $${paramCount++}`);
        values.push(productData.is_deal);
    }
    if (productData.measurements !== undefined) {
        fields.push(`measurements = $${paramCount++}`);
        values.push(productData.measurements);
    }
    if (productData.stock_quantity !== undefined) {
        fields.push(`stock_quantity = $${paramCount++}`);
        values.push(productData.stock_quantity);
    }

    if (fields.length === 0) {
        return null; // No fields to update
    }

    values.push(id);
    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;

    const result = await query(sql, values);
    return result.rows[0] || null;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
    const result = await query('DELETE FROM products WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
};
