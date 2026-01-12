import AdminLayout from '@/components/layouts/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';

import { getApiUrl } from '@/services/api';
const API_URL = getApiUrl();

export default function AdminProducts() {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const { toast } = useToast();

    const { data: products, isLoading } = useQuery({
        queryKey: ['admin-products'],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/products`);
            return response.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (productId: string) => {
            await axios.delete(`${API_URL}/products/${productId}`, {
                headers: { 'x-user-id': user?.id },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            toast({
                title: 'Success',
                description: 'Product deleted successfully',
            });
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to delete product',
                variant: 'destructive',
            });
        },
    });

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            deleteMutation.mutate(id);
        }
    };

    const filteredProducts = products?.filter((product: any) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;

        let matchesStatus = true;
        if (statusFilter === 'In Stock') matchesStatus = !product.isSold && product.stock_quantity >= 3;
        if (statusFilter === 'Low Stock') matchesStatus = !product.isSold && product.stock_quantity < 3;
        if (statusFilter === 'Sold Out') matchesStatus = product.isSold;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Products</h1>
                        <p className="text-muted-foreground mt-1">Manage your product inventory</p>
                    </div>
                    <Link
                        to="/admin/products/new"
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Add Product
                    </Link>
                </div>

                <div className="bg-card rounded-lg border border-border p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                            />
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                            >
                                <option value="All">All Categories</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Shoes">Shoes</option>
                                <option value="Accessories">Accessories</option>
                            </select>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                            >
                                <option value="All">All Status</option>
                                <option value="In Stock">In Stock</option>
                                <option value="Low Stock">Low Stock</option>
                                <option value="Sold Out">Sold Out</option>
                            </select>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-12 text-muted-foreground">Loading...</div>
                ) : (
                    <div className="bg-card rounded-lg border border-border overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-muted border-b border-border">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredProducts?.map((product: any) => (
                                    <tr key={product.id} className="hover:bg-muted/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                                <div>
                                                    <div className="font-medium text-foreground">{product.name}</div>
                                                    <div className="text-sm text-muted-foreground">{product.brand}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-foreground">{product.category}</td>
                                        <td className="px-6 py-4 text-sm text-foreground">
                                            KES {product.price.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-foreground">{product.stock_quantity}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.isSold
                                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                                    : product.stock_quantity < 3
                                                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
                                                        : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                                    }`}
                                            >
                                                {product.isSold ? 'Sold Out' : product.stock_quantity < 3 ? 'Low Stock' : 'In Stock'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Link
                                                to={`/admin/products/edit/${product.id}`}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id, product.name)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
