import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronLeft, Package, Clock, DollarSign, MapPin } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { useAuthStore } from '@/stores/authStore';
import { fetchUserOrders } from '@/services/api';
import { Button } from '@/components/ui/button';

export default function Orders() {
    const { user } = useAuthStore();

    const { data: orders, isLoading, error } = useQuery({
        queryKey: ['orders', user?.id],
        queryFn: () => fetchUserOrders(user?.id!),
        enabled: !!user?.id,
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'bg-success text-success-foreground';
            case 'SHIPPED': return 'bg-blue-500 text-white';
            case 'PAID': return 'bg-primary text-primary-foreground';
            case 'CANCELLED': return 'bg-destructive text-destructive-foreground';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pb-20 md:pb-8">
                <div className="container-custom py-8">
                    {/* Back Link */}
                    <Link
                        to="/account"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Account
                    </Link>

                    <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">
                        My Orders
                    </h1>

                    {isLoading && (
                        <div className="grid place-items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-20 text-destructive">
                            Failed to load orders. Please try again later.
                        </div>
                    )}

                    {!isLoading && !error && (!orders || orders.length === 0) && (
                        <div className="text-center py-20 bg-muted/30 rounded-lg">
                            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                            <p className="text-muted-foreground mb-6">
                                Looks like you haven't bought anything yet.
                            </p>
                            <Button asChild>
                                <Link to="/shop">Start Shopping</Link>
                            </Button>
                        </div>
                    )}

                    <div className="space-y-6">
                        {orders?.map((order) => (
                            <div key={order.id} className="bg-card border border-border rounded-lg overflow-hidden">
                                {/* Order Header */}
                                <div className="bg-muted/50 p-4 flex flex-wrap gap-4 items-center justify-between border-b border-border">
                                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Order ID</p>
                                            <p className="font-mono font-medium">#{order.id.slice(0, 8)}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Date Placed</p>
                                            <p className="font-medium">{formatDate(order.created_at)}</p>
                                        </div>
                                        <div className="flex gap-x-6">
                                            <div>
                                                <p className="text-muted-foreground">Total Amount</p>
                                                <p className="font-medium text-primary">KES {order.total_amount.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Items</p>
                                                <p className="font-medium">{order.items?.length || 0}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </div>
                                </div>

                                {/* Order Body */}
                                <div className="p-4">
                                    <div className="flex items-start gap-4">
                                        <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-sm">Delivery to</p>
                                            <p className="text-sm text-muted-foreground">{order.shipping_full_name}</p>
                                            <p className="text-sm text-muted-foreground">{order.shipping_address}</p>
                                            <p className="text-sm text-muted-foreground">{order.shipping_delivery_option}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 border-t border-border pt-4">
                                        <p className="text-sm font-medium mb-3">Items</p>
                                        <div className="space-y-3">
                                            {order.items?.map((item: any) => (
                                                <div key={item.id || item.product_id} className="flex gap-3 items-center bg-muted/20 p-2 rounded-lg">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-12 h-12 object-cover rounded bg-muted"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                                                        <p className="text-xs text-muted-foreground">Price: KES {item.price.toLocaleString()}</p>
                                                    </div>
                                                    <div className="bg-background border border-border px-2 py-1 rounded text-xs font-semibold">
                                                        Qty: {item.quantity}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </main>

            <Footer />
            <MobileBottomNav />
        </div>
    );
}
