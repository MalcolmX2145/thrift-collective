import { Request, Response } from 'express';
import { query } from '../config/db';

export const checkHealth = async (req: Request, res: Response) => {
    try {
        const dbResult = await query('SELECT NOW()');
        res.json({
            status: 'ok',
            timestamp: new Date(),
            database: dbResult.rows[0].now ? 'connected' : 'disconnected',
        });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({
            status: 'error',
            timestamp: new Date(),
            database: 'disconnected',
            error: 'Database connection failed',
        });
    }
};
