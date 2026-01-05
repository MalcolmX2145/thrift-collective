import { query } from '../config/db';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const cleanup = async () => {
    try {
        console.log('🧹 Starting cleanup of PENDING entries...');

        // Delete PENDING payments first (foreign key constraint usually on order_id)
        const paymentResult = await query(
            `DELETE FROM payments WHERE status = 'PENDING'`
        );
        console.log(`✅ Deleted ${paymentResult.rowCount} PENDING payments.`);

        // Delete PENDING orders
        const orderResult = await query(
            `DELETE FROM orders WHERE status = 'PENDING'`
        );
        console.log(`✅ Deleted ${orderResult.rowCount} PENDING orders.`);

    } catch (error) {
        console.error('❌ Cleanup Failed:', error);
    } finally {
        process.exit(0);
    }
};

cleanup();
