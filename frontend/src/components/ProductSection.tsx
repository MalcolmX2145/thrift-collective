import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';

interface ProductSectionProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

export function ProductSection({ title, products, viewAllLink }: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-8 md:py-12">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl md:text-2xl font-bold">{title}</h2>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="flex items-center text-sm font-medium text-primary hover:underline"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          )}
        </div>

        {/* Horizontal Scrollable Grid */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-x-visible">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className="flex-shrink-0 w-[160px] md:w-auto"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
