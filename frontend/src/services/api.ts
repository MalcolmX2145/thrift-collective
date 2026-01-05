import axios from 'axios';
import { Product, Order } from '@/types';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchProducts = async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
};

export const fetchProductById = async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

export const fetchUserOrders = async (userId: string): Promise<Order[]> => {
    const response = await api.get(`/orders/user/${userId}`);
    return response.data;
};

export default api;
