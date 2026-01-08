import { Request, Response, NextFunction } from 'express';
import { findUserById } from '../models/User';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: string;
            };
        }
    }
}

// Middleware to check if user is authenticated (basic version)
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    try {
        const user = await findUserById(userId);
        if (!user) {
            res.status(401).json({ error: 'Invalid user' });
            return;
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Middleware to check if user is admin
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    // First ensure user is authenticated
    await requireAuth(req, res, () => {
        if (!req.user || req.user.role !== 'ADMIN' || req.user.email !== 'admin@thriftcollective.com') {
            res.status(403).json({ error: 'Admin access required' });
            return;
        }
        next();
    });
};
