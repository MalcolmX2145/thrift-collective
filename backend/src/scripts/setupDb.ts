import { query } from '../config/db';

const setupDb = async () => {
    try {
        console.log('Creating products table...');
        await query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        images TEXT[],
        category VARCHAR(50) NOT NULL,
        sub_category VARCHAR(50),
        sizes TEXT[],
        condition VARCHAR(50),
        brand VARCHAR(100),
        is_sold BOOLEAN DEFAULT FALSE,
        is_new BOOLEAN DEFAULT FALSE,
        is_trending BOOLEAN DEFAULT FALSE,
        is_premium BOOLEAN DEFAULT FALSE,
        is_deal BOOLEAN DEFAULT FALSE,
        measurements JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
        console.log('Products table created successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error setting up database:', err);
        process.exit(1);
    }
};

setupDb();
