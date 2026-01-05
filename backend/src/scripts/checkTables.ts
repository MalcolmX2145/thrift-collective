import { query } from '../config/db';

const checkTables = async () => {
    try {
        const result = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

        console.log('Tables in database:');
        result.rows.forEach(row => console.log(`- ${row.table_name}`));

    } catch (error) {
        console.error('Error checking tables:', error);
    } finally {
        process.exit();
    }
};

checkTables();
