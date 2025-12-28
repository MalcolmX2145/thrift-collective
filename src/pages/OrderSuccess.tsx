import { Link } from 'react-router-dom';
import { Check, Package, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Button } from '@/components/ui/button';

export default function OrderSuccess() {
  const orderNumber = `TC${Date.now().toString().slice(-8)}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-custom py-16">
        <div className="max-w-lg mx-auto text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <Check className="h-10 w-10 text-success-foreground" />
          </div>

          <h1 className="font-display text-3xl font-bold mb-2 animate-fade-up">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground mb-8 animate-fade-up animation-delay-100">
            Thank you for shopping with The Thrift Collective
          </p>

          {/* Order Details Card */}
          <div className="bg-card rounded-lg border border-border p-6 text-left mb-8 animate-fade-up animation-delay-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-mono font-bold">{orderNumber}</p>
              </div>
            </div>

            <hr className="border-border my-4" />

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-success rounded-full" />
                <span>Payment confirmed via M-Pesa</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-primary rounded-full" />
                <span>Order confirmation sent to your phone</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-accent rounded-full" />
                <span>Delivery updates will be sent via SMS</span>
              </div>
            </div>
          </div>

          {/* Expected Delivery */}
          <div className="bg-secondary/50 rounded-lg p-4 mb-8 animate-fade-up animation-delay-300">
            <p className="text-sm font-medium">Expected Delivery</p>
            <p className="text-lg font-bold text-secondary-foreground">
              Today by 6:00 PM
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animation-delay-300">
            <Button asChild size="lg">
              <Link to="/shop">
                Continue Shopping
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/">
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Contact Info */}
          <p className="text-sm text-muted-foreground mt-8">
            Questions about your order?{' '}
            <a href="tel:+254712345678" className="text-primary hover:underline">
              Call us at +254 712 345 678
            </a>
          </p>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
