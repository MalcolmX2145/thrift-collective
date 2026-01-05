import { query } from '../config/db';

const addAvatarUrlToUsers = async () => {
    try {
        await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS avatar_url TEXT;
    `);
        console.log('Successfully altered users table: added avatar_url column.');
    } catch (error) {
        console.error('Error altering users table:', error);
    } finally {
        process.exit();
    }
};

addAvatarUrlToUsers();
