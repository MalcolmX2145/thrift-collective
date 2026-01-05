import { query } from '../config/db';

const alterUsersTable = async () => {
    try {
        // 1. Make password_hash nullable
        await query(`
      ALTER TABLE users 
      ALTER COLUMN password_hash DROP NOT NULL;
    `);
        console.log('Successfully altered users table: password_hash is now nullable.');

        // 2. Add google_id column if it doesn't exist (optional but good for tracking)
        await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
    `);
        console.log('Successfully altered users table: added google_id column.');

    } catch (error) {
        console.error('Error altering users table:', error);
    } finally {
        process.exit();
    }
};

alterUsersTable();
