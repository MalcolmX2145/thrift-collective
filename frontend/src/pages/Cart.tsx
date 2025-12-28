import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { useToast } from '@/hooks/use-toast';

export default function Cart() {
  const { items, removeItem, clearCart, getTotal } = useCartStore();
  const { toast } = useToast();

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const handleRemoveItem = (productId: string, name: string) => {
    removeItem(productId);
    toast({
      title: 'Removed from cart',
      description: `${name} has been removed from your cart.`,
    });
  };

  const subtotal = getTotal();
  const deliveryFee = 300; // Same-day delivery
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container-custom py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any unique pieces yet. Start exploring our collection!
            </p>
            <Button asChild size="lg">
              <Link to="/shop">
                Start Shopping
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-20 md:pb-8">
        <div className="container-custom py-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">
            Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 p-4 bg-card rounded-lg border border-border animate-fade-in"
                >
                  {/* Product Image */}
                  <Link
                    to={`/product/${item.productId}`}
                    className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 bg-muted rounded-lg overflow-hidden"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.productId}`}
                      className="font-medium hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    {item.size && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Size: {item.size}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="inline-flex items-center gap-1">
                        <span className="h-1.5 w-1.5 bg-warning rounded-full animate-pulse" />
                        Only 1 available
                      </span>
                    </p>
                    <p className="font-bold text-primary mt-2">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.productId, item.name)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors self-start"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}

              <div className="flex justify-between pt-4">
                <Link
                  to="/shop"
                  className="text-sm text-primary hover:underline"
                >
                  ← Continue Shopping
                </Link>
                <button
                  onClick={() => {
                    clearCart();
                    toast({ title: 'Cart cleared' });
                  }}
                  className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                <h2 className="font-display text-xl font-bold mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Delivery (Same-day Nairobi)
                    </span>
                    <span className="font-medium">{formatPrice(deliveryFee)}</span>
                  </div>

                  <hr className="border-border" />

                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg text-primary">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <Button asChild variant="cart" size="lg" className="w-full mt-6">
                  <Link to="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Secure checkout with M-Pesa
                </p>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-border space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="h-2 w-2 bg-success rounded-full" />
                    Same-day delivery in Nairobi CBD
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="h-2 w-2 bg-primary rounded-full" />
                    All items quality checked
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="h-2 w-2 bg-accent rounded-full" />
                    Secure M-Pesa payment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
