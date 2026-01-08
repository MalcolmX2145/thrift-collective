import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Phone, MapPin, Truck, Check, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type DeliveryOption = 'SAME_DAY' | 'NEXT_DAY' | 'PICKUP';
type PaymentStatus = 'idle' | 'pending' | 'success' | 'failed';

const deliveryOptions = [
  {
    id: 'SAME_DAY' as DeliveryOption,
    name: 'Same-day Delivery',
    description: 'Nairobi CBD',
    price: 300,
    icon: Truck,
  },
  {
    id: 'NEXT_DAY' as DeliveryOption,
    name: 'Next-day Delivery',
    description: 'Greater Nairobi',
    price: 250,
    icon: MapPin,
  },
  {
    id: 'PICKUP' as DeliveryOption,
    name: 'Pick up from Shop',
    description: 'Westlands, Nairobi',
    price: 0,
    icon: MapPin,
  },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, getTotal, clearCart } = useCartStore();

  const [step, setStep] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');

  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('SAME_DAY');

  const subtotal = getTotal();
  const deliveryFee = deliveryOptions.find((o) => o.id === deliveryOption)?.price || 0;
  const total = subtotal + deliveryFee;

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const validatePhone = (value: string) => {
    const kenyanPhoneRegex = /^(07|01)\d{8}$/;
    return kenyanPhoneRegex.test(value.replace(/\s/g, ''));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast({ title: 'Please enter your full name', variant: 'destructive' });
      return;
    }

    if (!validatePhone(phone)) {
      toast({
        title: 'Invalid phone number',
        description: 'Please enter a valid Kenyan phone number (07XX or 01XX)',
        variant: 'destructive',
      });
      return;
    }

    if (deliveryOption !== 'PICKUP' && !address.trim()) {
      toast({ title: 'Please enter your delivery address', variant: 'destructive' });
      return;
    }

    setStep(2);
  };

  const { user } = useAuthStore();

  // Polling state
  const [orderId, setOrderId] = useState<string | null>(null);

  // Poll for order status
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (paymentStatus === 'pending' && orderId) {
      intervalId = setInterval(async () => {
        try {
          const res = await api.get(`/orders/${orderId}`);
          // Check if order status is PAID
          if (res.data.status === 'PAID') {
            setPaymentStatus('success');
            clearCart();
            toast({
              title: 'Payment Successful!',
              description: 'Your order has been confirmed.',
            });
            setTimeout(() => navigate('/account'), 3000); // Redirect to account/orders instead of generic success for now
          }
        } catch (error) {
          console.error('Polling error', error);
        }
      }, 3000); // Poll every 3 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [paymentStatus, orderId, navigate, clearCart, toast]);

  const handlePayment = async () => {
    setPaymentStatus('pending');

    try {
      // Create Order Payload
      const orderData = {
        user_id: user?.id,
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity, // Setup quantity correctly from cart item
          image: item.image
        })),
        total_amount: total,
        delivery_fee: deliveryFee,
        shipping_info: {
          fullName,
          phone,
          address,
          deliveryOption
        }
      };

      // 1. Create Order in Backend
      const orderRes = await api.post('/orders', orderData);
      const newOrderId = orderRes.data.order.id;
      setOrderId(newOrderId);

      // 2. Initiate M-Pesa Payment
      await api.post('/payments/initiate', {
        order_id: newOrderId,
        amount: total,
        phone_number: phone
      });

      toast({
        title: 'M-Pesa Request Sent',
        description: 'Please check your phone to complete the payment.',
      });

    } catch (error: any) {
      console.error('Checkout error:', error);
      setPaymentStatus('failed');
      toast({
        title: 'Order Failed',
        description: error.response?.data?.error || 'Could not place order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (items.length === 0 && paymentStatus !== 'success') {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-20 md:pb-8">
        <div className="container-custom py-8">
          {/* Back Link */}
          <Link
            to="/cart"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Cart
          </Link>

          <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">
            Checkout
          </h1>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors',
                    step >= s
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {step > s ? <Check className="h-4 w-4" /> : s}
                </div>
                <span
                  className={cn(
                    'text-sm font-medium',
                    step >= s ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {s === 1 ? 'Shipping' : 'Payment'}
                </span>
                {s < 2 && (
                  <div
                    className={cn(
                      'w-12 h-0.5 mx-2',
                      step > s ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h2 className="font-display text-xl font-bold mb-6">
                      Shipping Information
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="John Doe"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative mt-1">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="0712 345 678"
                            className="pl-10"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          M-Pesa payment prompt will be sent to this number
                        </p>
                      </div>

                      {/* Delivery Options */}
                      <div>
                        <Label>Delivery Option</Label>
                        <div className="grid gap-3 mt-2">
                          {deliveryOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => setDeliveryOption(option.id)}
                                className={cn(
                                  'flex items-center gap-4 p-4 rounded-lg border transition-colors text-left',
                                  deliveryOption === option.id
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50'
                                )}
                              >
                                <div
                                  className={cn(
                                    'p-2 rounded-full',
                                    deliveryOption === option.id
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted'
                                  )}
                                >
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{option.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {option.description}
                                  </p>
                                </div>
                                <span className="font-semibold">
                                  {option.price === 0
                                    ? 'Free'
                                    : formatPrice(option.price)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {deliveryOption !== 'PICKUP' && (
                        <div>
                          <Label htmlFor="address">Delivery Address</Label>
                          <Textarea
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Building name, street, area..."
                            className="mt-1"
                            rows={3}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full md:w-auto">
                    Continue to Payment
                  </Button>
                </form>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  {/* Order Review */}
                  <div className="bg-card rounded-lg border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-display text-xl font-bold">
                        Review Your Order
                      </h2>
                      <button
                        onClick={() => setStep(1)}
                        className="text-sm text-primary hover:underline"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Shipping Details */}
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="font-medium">{fullName}</p>
                        <p className="text-sm text-muted-foreground">{phone}</p>
                        {address && (
                          <p className="text-sm text-muted-foreground">{address}</p>
                        )}
                        <p className="text-sm text-primary mt-2">
                          {deliveryOptions.find((o) => o.id === deliveryOption)?.name}
                        </p>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item.productId} className="flex gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.name}</p>
                              {item.size && (
                                <p className="text-sm text-muted-foreground">
                                  Size: {item.size}
                                </p>
                              )}
                            </div>
                            <p className="font-semibold">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* M-Pesa Payment */}
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h2 className="font-display text-xl font-bold mb-6">
                      Pay with M-Pesa
                    </h2>

                    {paymentStatus === 'idle' && (
                      <div className="space-y-4">
                        <div className="p-4 bg-success/10 rounded-lg">
                          <p className="text-sm">
                            <strong>Payment Number:</strong> {phone}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            You'll receive an M-Pesa prompt on this number
                          </p>
                        </div>

                        <Button
                          onClick={handlePayment}
                          variant="success"
                          size="lg"
                          className="w-full"
                        >
                          Pay {formatPrice(total)} with M-Pesa
                        </Button>
                      </div>
                    )}

                    {paymentStatus === 'pending' && (
                      <div className="text-center py-8">
                        <Loader2 className="h-12 w-12 mx-auto animate-spin text-success mb-4" />
                        <p className="font-medium text-lg mb-2">
                          Check your phone for M-Pesa prompt
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Enter your M-Pesa PIN to complete payment
                        </p>
                      </div>
                    )}

                    {paymentStatus === 'success' && (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                          <Check className="h-8 w-8 text-success-foreground" />
                        </div>
                        <p className="font-medium text-lg mb-2 text-success">
                          Payment Successful!
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Redirecting to order confirmation...
                        </p>
                      </div>
                    )}

                    {paymentStatus === 'failed' && (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">❌</span>
                        </div>
                        <p className="font-medium text-lg mb-2 text-destructive">
                          Payment Failed
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          The transaction was not completed. Please try again.
                        </p>
                        <Button onClick={handlePayment} variant="default" size="lg">
                          Try Again
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                <h2 className="font-display text-lg font-bold mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subtotal ({items.length} items)
                    </span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>
                      {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm font-medium mb-3">Items</p>
                  <div className="flex flex-wrap gap-2">
                    {items.slice(0, 4).map((item) => (
                      <img
                        key={item.productId}
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ))}
                    {items.length > 4 && (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-sm font-medium">
                        +{items.length - 4}
                      </div>
                    )}
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
