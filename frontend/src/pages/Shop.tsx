import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Filter, X, ChevronDown, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { ProductCard } from '@/components/ProductCard';
import { fetchProducts } from '@/services/api';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = ['All', 'Women', 'Men', 'Unisex'];
const subcategories = ['All', 'Jackets', 'Jeans', 'Sneakers', 'Bags', 'Accessories', 'Tops', 'Dresses'];
const conditions = ['All', 'Like New', 'Good', 'Vintage'];
const collections = [
  { value: 'all', label: 'All Products' },
  { value: 'new-arrivals', label: 'New Arrivals' },
  { value: 'trending', label: 'Trending' },
  { value: 'premium', label: 'Premium Pieces' },
  { value: 'deals', label: 'Under Ksh 500' },
  { value: 'jackets', label: 'Jackets' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // Get filter values from URL
  const selectedCategory = searchParams.get('category') || 'All';
  const selectedSubcategory = searchParams.get('subcategory') || 'All';
  const selectedCondition = searchParams.get('condition') || 'All';
  const selectedCollection = searchParams.get('collection') || 'all';

  // Filter products
  let filteredProducts = products.filter((p) => !p.isSold);

  if (selectedCategory !== 'All') {
    filteredProducts = filteredProducts.filter(
      (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  if (selectedSubcategory !== 'All') {
    filteredProducts = filteredProducts.filter(
      (p) => p.subCategory.toLowerCase() === selectedSubcategory.toLowerCase()
    );
  }

  if (selectedCondition !== 'All') {
    filteredProducts = filteredProducts.filter(
      (p) => p.condition === selectedCondition
    );
  }

  if (selectedCollection !== 'all') {
    switch (selectedCollection) {
      case 'new-arrivals':
        filteredProducts = filteredProducts.filter((p) => p.isNew);
        break;
      case 'trending':
        filteredProducts = filteredProducts.filter((p) => p.isTrending);
        break;
      case 'premium':
        filteredProducts = filteredProducts.filter((p) => p.isPremium);
        break;
      case 'deals':
        filteredProducts = filteredProducts.filter((p) => p.price <= 500 || p.isDeal);
        break;
      case 'jackets':
        filteredProducts = filteredProducts.filter((p) => p.subCategory === 'JACKETS');
        break;
    }
  }

  // Sort products
  switch (sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'All' || value === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedSubcategory !== 'All' ||
    selectedCondition !== 'All' ||
    selectedCollection !== 'all';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-red-500">Failed to load products. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-20 md:pb-0">
        {/* Page Header */}
        <div className="bg-muted py-8 md:py-12">
          <div className="container-custom">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              {selectedCollection !== 'all'
                ? collections.find((c) => c.value === selectedCollection)?.label
                : 'Shop All'}
            </h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} unique pieces available
            </p>
          </div>
        </div>

        <div className="container-custom py-6">
          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors md:hidden"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="h-2 w-2 bg-primary rounded-full" />
              )}
            </button>

            {/* Desktop Filters */}
            <div className="hidden md:flex items-center gap-4 flex-wrap">
              <Select
                value={selectedCategory}
                onValueChange={(v) => updateFilter('category', v)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedSubcategory}
                onValueChange={(v) => updateFilter('subcategory', v)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedCondition}
                onValueChange={(v) => updateFilter('condition', v)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((cond) => (
                    <SelectItem key={cond} value={cond}>
                      {cond}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Filter Panel */}
          <div
            className={cn(
              'md:hidden fixed inset-0 z-50 bg-background transition-transform duration-300',
              isFilterOpen ? 'translate-x-0' : 'translate-x-full'
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-display text-xl font-bold">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-140px)]">
              {/* Collection Filter */}
              <div>
                <h3 className="font-semibold mb-3">Collection</h3>
                <div className="space-y-2">
                  {collections.map((col) => (
                    <button
                      key={col.value}
                      onClick={() => updateFilter('collection', col.value)}
                      className={cn(
                        'block w-full text-left px-3 py-2 rounded-lg transition-colors',
                        selectedCollection === col.value
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      )}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="font-semibold mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateFilter('category', cat)}
                      className={cn(
                        'block w-full text-left px-3 py-2 rounded-lg transition-colors',
                        selectedCategory === cat
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategory Filter */}
              <div>
                <h3 className="font-semibold mb-3">Type</h3>
                <div className="space-y-2">
                  {subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => updateFilter('subcategory', sub)}
                      className={cn(
                        'block w-full text-left px-3 py-2 rounded-lg transition-colors',
                        selectedSubcategory === sub
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      )}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition Filter */}
              <div>
                <h3 className="font-semibold mb-3">Condition</h3>
                <div className="space-y-2">
                  {conditions.map((cond) => (
                    <button
                      key={cond}
                      onClick={() => updateFilter('condition', cond)}
                      className={cn(
                        'block w-full text-left px-3 py-2 rounded-lg transition-colors',
                        selectedCondition === cond
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      )}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
              <div className="flex gap-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Show Results ({filteredProducts.length})
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                No products found matching your filters.
              </p>
              <button
                onClick={clearFilters}
                className="text-primary font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
