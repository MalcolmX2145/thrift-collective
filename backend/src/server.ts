import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
import { router as healthRoutes } from './routes/healthRoutes';
import productRoutes from './routes/productRoutes';

app.use('/api', healthRoutes);
app.use('/api/products', productRoutes);

import { query } from './config/db';

app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    try {
        await query('SELECT NOW()');
        console.log('Database connected successfully to Neon');
    } catch (err) {
        console.error('Database connection failed', err);
    }
});
