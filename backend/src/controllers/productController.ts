import { Request, Response } from 'express';
import { query } from '../config/db';

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM products ORDER BY created_at DESC');

        // Map database fields (snake_case) to frontend expected format (camelCase)
        const products = result.rows.map(row => ({
            id: row.id,
            name: row.name,
            description: row.description,
            price: row.price,
            images: row.images,
            category: row.category,
            subCategory: row.sub_category,
            sizes: row.sizes,
            condition: row.condition,
            brand: row.brand,
            isSold: row.is_sold,
            isNew: row.is_new,
            isTrending: row.is_trending,
            isPremium: row.is_premium,
            isDeal: row.is_deal,
            measurements: row.measurements,
            stock_quantity: row.stock_quantity,
            createdAt: row.created_at,
        }));

        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await query('SELECT * FROM products WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Product not found' });
            return; // Ensure function returns here
        }

        const row = result.rows[0];
        const product = {
            id: row.id,
            name: row.name,
            description: row.description,
            price: row.price,
            images: row.images,
            category: row.category,
            subCategory: row.sub_category,
            sizes: row.sizes,
            condition: row.condition,
            brand: row.brand,
            isSold: row.is_sold,
            isNew: row.is_new,
            isTrending: row.is_trending,
            isPremium: row.is_premium,
            isDeal: row.is_deal,
            measurements: row.measurements,
            stock_quantity: row.stock_quantity,
            createdAt: row.created_at,
        };

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
