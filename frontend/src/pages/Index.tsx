import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { HeroSection } from '@/components/HeroSection';
import { CategoryGrid } from '@/components/CategoryGrid';
import { ProductSection } from '@/components/ProductSection';
import { fetchProducts } from '@/services/api';
import { Product } from '@/types';

const Index = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const getProductsByCollection = (type: string): Product[] => {
    switch (type) {
      case 'new-arrivals':
        return products.filter(p => p.isNew && !p.isSold).slice(0, 8);
      case 'trending':
        return products.filter(p => p.isTrending && !p.isSold).slice(0, 8);
      case 'premium':
        return products.filter(p => p.isPremium && !p.isSold).slice(0, 8);
      case 'deals':
        return products.filter(p => (p.isDeal || p.price <= 500) && !p.isSold).slice(0, 8);
      case 'jackets':
        return products.filter(p => p.subCategory === 'JACKETS' && !p.isSold).slice(0, 8);
      default:
        return products.filter(p => !p.isSold).slice(0, 8);
    }
  };

  const newArrivals = getProductsByCollection('new-arrivals');
  const trending = getProductsByCollection('trending');
  const premium = getProductsByCollection('premium');
  const deals = getProductsByCollection('deals');
  const jackets = getProductsByCollection('jackets');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <HeroSection />

        <CategoryGrid />

        <ProductSection
          title="New Arrivals"
          products={newArrivals}
          viewAllLink="/shop?collection=new-arrivals"
        />

        {/* Promo Banner */}
        <section className="py-8 md:py-12 bg-secondary">
          <div className="container-custom text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-secondary-foreground mb-2">
              Deals Under Ksh 500
            </h2>
            <p className="text-secondary-foreground/80 mb-4">
              Sustainable style doesn't have to break the bank
            </p>
            <a
              href="/shop?collection=deals"
              className="inline-block font-medium text-secondary-foreground underline underline-offset-4 hover:text-primary transition-colors"
            >
              Shop Deals →
            </a>
          </div>
        </section>

        <ProductSection
          title="Trending Now"
          products={trending}
          viewAllLink="/shop?collection=trending"
        />

        <ProductSection
          title="Premium Pieces"
          products={premium}
          viewAllLink="/shop?collection=premium"
        />

        <ProductSection
          title="Jacket Collection"
          products={jackets}
          viewAllLink="/shop?collection=jackets"
        />

        <ProductSection
          title="Ksh 500 Deals"
          products={deals}
          viewAllLink="/shop?collection=deals"
        />

        {/* Newsletter Section */}
        <section className="py-12 md:py-16 bg-accent/20">
          <div className="container-custom text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
              Join The Collective
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Get first access to new drops, exclusive deals, and sustainable fashion tips.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Index;
