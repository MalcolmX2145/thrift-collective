import { query } from '../config/db';

const createTables = async () => {
    try {
        // 1. Users Table
        await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('Users table created.');

        // 2. Orders Table
        await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        total_amount INTEGER NOT NULL,
        delivery_fee INTEGER NOT NULL,
        status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
        shipping_full_name VARCHAR(255) NOT NULL,
        shipping_phone VARCHAR(20) NOT NULL,
        shipping_address TEXT NOT NULL,
        shipping_delivery_option VARCHAR(20) NOT NULL,
        conversation_id VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('Orders table created.');

        // 3. Order Items Table
        await query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
        product_id VARCHAR(255) REFERENCES products(id),
        product_name VARCHAR(255) NOT NULL,
        product_price INTEGER NOT NULL,
        quantity INTEGER DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('Order Items table created.');

        // 4. Payments Table
        await query(`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID REFERENCES orders(id),
        amount INTEGER NOT NULL,
        provider VARCHAR(20) DEFAULT 'MPESA',
        status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED')),
        phone_number VARCHAR(20) NOT NULL,
        transaction_code VARCHAR(50),
        merchant_request_id VARCHAR(255),
        checkout_request_id VARCHAR(255),
        result_desc VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('Payments table created.');

        console.log('All tables created successfully.');
    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        process.exit();
    }
};

createTables();
