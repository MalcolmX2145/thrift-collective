import { Request, Response } from 'express';
import { createOrder, createOrderItem, getOrderById, findOrdersByUserId } from '../models/Order';
import { updateProductStock } from '../models/Product';
import { OrderItem } from '../models/Order';

export const createNewOrder = async (req: Request, res: Response) => {
    const { user_id, items, total_amount, delivery_fee, shipping_info } = req.body;

    if (!items || items.length === 0 || !shipping_info) {
        res.status(400).json({ error: 'Invalid order data' });
        return;
    }

    try {
        // 1. Create Order
        const order = await createOrder({
            user_id: user_id || null, // Can be null for guest checkout if we allow it
            total_amount,
            delivery_fee,
            status: 'PENDING',
            shipping_full_name: shipping_info.fullName,
            shipping_phone: shipping_info.phone,
            shipping_address: shipping_info.address || '',
            shipping_delivery_option: shipping_info.deliveryOption,
        });

        // 2. Create Order Items
        const createdItems = [];
        for (const item of items) {
            const orderItem = await createOrderItem({
                order_id: order.id,
                product_id: item.productId,
                product_name: item.name,
                product_price: item.price,
                quantity: 1, // Default to 1 as per thrift model
            });
            createdItems.push(orderItem);

            // 3. Update Stock
            await updateProductStock(item.productId, 1);
        }

        res.status(201).json({ order, items: createdItems });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const order = await getOrderById(id);
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        // We could fetch items here too if needed, keeping it simple for now
        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUserOrders = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const orders = await findOrdersByUserId(userId);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
