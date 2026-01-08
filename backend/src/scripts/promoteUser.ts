import { query } from '../config/db';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const promoteUser = async () => {
    try {
        const email = 'ekajjamalcolm@gmail.com';

        await query(
            "UPDATE users SET role = 'ADMIN' WHERE email = $1",
            [email]
        );

        console.log('✅ User promoted to ADMIN successfully!');
        console.log('');
        console.log('📧 Email:', email);
        console.log('🔑 Role: ADMIN');
        console.log('');
        console.log('You can now access the admin panel at /admin');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        process.exit(0);
    }
};

promoteUser();
