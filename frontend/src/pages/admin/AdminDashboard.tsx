import AdminLayout from '@/components/layouts/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { Package, TrendingUp, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function AdminDashboard() {
    const { data: products } = useQuery({
        queryKey: ['admin-products'],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/products`);
            return response.data;
        },
    });

    const totalProducts = products?.length || 0;
    const lowStockProducts = products?.filter((p: any) => p.stock_quantity < 3 && !p.isSold).length || 0;
    const soldProducts = products?.filter((p: any) => p.isSold).length || 0;

    const stats = [
        {
            label: 'Total Products',
            value: totalProducts,
            icon: Package,
            color: 'bg-blue-500',
        },
        {
            label: 'Low Stock',
            value: lowStockProducts,
            icon: AlertCircle,
            color: 'bg-orange-500',
        },
        {
            label: 'Sold Out',
            value: soldProducts,
            icon: TrendingUp,
            color: 'bg-green-500',
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Overview of your store</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                                        <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                                    </div>
                                    <div className={`${stat.color} p-3 rounded-lg`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-card rounded-lg border border-border p-6">
                    <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
                    <div className="flex gap-4">
                        <Link
                            to="/admin/products/new"
                            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                        >
                            Add New Product
                        </Link>
                        <Link
                            to="/admin/products"
                            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
                        >
                            Manage Products
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
