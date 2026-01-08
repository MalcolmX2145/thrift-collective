import { query } from '../config/db';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const listUsers = async () => {
    try {
        const result = await query(
            'SELECT id, name, email, role, created_at FROM users ORDER BY created_at ASC'
        );

        console.log('\n📋 All Users:\n');
        result.rows.forEach((user, index) => {
            console.log(`${index + 1}. ${user.email}`);
            console.log(`   Name: ${user.name}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   ID: ${user.id}`);
            console.log('');
        });

        console.log(`Total users: ${result.rows.length}`);

    } catch (error) {
        console.error('❌ Error listing users:', error);
    } finally {
        process.exit(0);
    }
};

listUsers();
