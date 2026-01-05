import { query } from '../config/db';

export interface Order {
    id: string;
    user_id?: string;
    total_amount: number;
    delivery_fee: number;
    status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    shipping_full_name: string;
    shipping_phone: string;
    shipping_address: string;
    shipping_delivery_option: string;
    conversation_id?: string;
    created_at: Date;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    product_price: number;
    quantity: number;
    created_at: Date;
}

export const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
    const {
        user_id,
        total_amount,
        delivery_fee,
        status,
        shipping_full_name,
        shipping_phone,
        shipping_address,
        shipping_delivery_option,
    } = orderData;

    const sql = `
    INSERT INTO orders (
      user_id, total_amount, delivery_fee, status,
      shipping_full_name, shipping_phone, shipping_address, shipping_delivery_option
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
    const params = [
        user_id,
        total_amount,
        delivery_fee,
        status || 'PENDING',
        shipping_full_name,
        shipping_phone,
        shipping_address,
        shipping_delivery_option,
    ];

    const result = await query(sql, params);
    return result.rows[0];
};

export const createOrderItem = async (itemData: Partial<OrderItem>): Promise<OrderItem> => {
    const { order_id, product_id, product_name, product_price, quantity } = itemData;
    const sql = `
    INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
    const result = await query(sql, [order_id, product_id, product_name, product_price, quantity || 1]);
    return result.rows[0];
};

export const getOrderById = async (id: string): Promise<Order | null> => {
    const result = await query('SELECT * FROM orders WHERE id = $1', [id]);
    return result.rows[0] || null;
};

export const findOrdersByUserId = async (userId: string): Promise<Order[]> => {
    const sql = `
        SELECT o.*, 
            COALESCE(
                json_agg(
                    json_build_object(
                        'id', oi.id,
                        'product_id', oi.product_id,
                        'name', oi.product_name,
                        'price', oi.product_price,
                        'quantity', oi.quantity,
                        'image', p.images[1]
                    )
                ) FILTER (WHERE oi.id IS NOT NULL), 
                '[]'
            ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC
    `;
    const result = await query(sql, [userId]);
    return result.rows;
};

export const updateOrderStatus = async (id: string, status: string): Promise<void> => {
    await query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
};
