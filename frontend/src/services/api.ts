import axios from 'axios';
import { Product, Order } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getApiUrl = () => API_URL;

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
