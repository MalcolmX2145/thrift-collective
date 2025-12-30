import { query } from '../config/db';

const verify = async () => {
    try {
        const res = await query('SELECT COUNT(*) FROM products');
        console.log(`Verification: Found ${res.rows[0].count} products in the database.`);
        process.exit(0);
    } catch (err) {
        console.error('Verification failed:', err);
        process.exit(1);
    }
};

verify();
