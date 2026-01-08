import { query } from '../config/db';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const createAdmin = async () => {
    try {
        const adminEmail = 'admin@thriftcollective.com';
        const adminPassword = 'Admin@2026'; // Simple password for now
        const adminName = 'Admin User';

        // Check if admin already exists
        const existing = await query('SELECT * FROM users WHERE email = $1', [adminEmail]);

        if (existing.rows.length > 0) {
            console.log('⚠️  Admin user already exists!');
            console.log('📧 Email:', adminEmail);
            console.log('🔑 Password: Admin@2026');
            process.exit(0);
            return;
        }

        // Create admin user
        const sql = `
            INSERT INTO users (name, email, password_hash, role)
            VALUES ($1, $2, $3, 'ADMIN')
            RETURNING *
        `;

        const result = await query(sql, [adminName, adminEmail, adminPassword]);

        console.log('✅ Admin user created successfully!');
        console.log('');
        console.log('📧 Email:', adminEmail);
        console.log('🔑 Password:', adminPassword);
        console.log('');
        console.log('⚠️  IMPORTANT: Change this password after first login!');

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    } finally {
        process.exit(0);
    }
};

createAdmin();
