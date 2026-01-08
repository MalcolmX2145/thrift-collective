import { query } from '../config/db';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const promoteToAdmin = async () => {
    try {
        // Get the most recent user
        const result = await query(
            'SELECT id, name, email, role FROM users ORDER BY created_at DESC LIMIT 1'
        );

        if (result.rows.length === 0) {
            console.log('❌ No users found in database');
            process.exit(1);
        }

        const user = result.rows[0];

        if (user.role === 'ADMIN') {
            console.log('✅ User is already an admin!');
            console.log('📧 Email:', user.email);
            process.exit(0);
        }

        // Update user to admin
        await query('UPDATE users SET role = $1 WHERE id = $2', ['ADMIN', user.id]);

        console.log('✅ User promoted to admin successfully!');
        console.log('');
        console.log('📧 Email:', user.email);
        console.log('👤 Name:', user.name);
        console.log('🔑 Role: ADMIN');
        console.log('');
        console.log('You can now access the admin panel at /admin');

    } catch (error) {
        console.error('❌ Error promoting user:', error);
    } finally {
        process.exit(0);
    }
};

promoteToAdmin();
