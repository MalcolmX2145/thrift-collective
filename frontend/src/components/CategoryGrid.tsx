import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Category {
  name: string;
  href: string;
  image: string;
}

const categories: Category[] = [
  {
    name: 'Women',
    href: '/shop?category=women',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600',
  },
  {
    name: 'Men',
    href: '/shop?category=men',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
  },
  {
    name: 'Jackets',
    href: '/shop?subcategory=jackets',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
  },
  {
    name: 'Sneakers',
    href: '/shop?subcategory=sneakers',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600',
  },
  {
    name: 'Bags',
    href: '/shop?subcategory=bags',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
  },
  {
    name: 'Accessories',
    href: '/shop?subcategory=accessories',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600',
  },
];

export function CategoryGrid() {
  return (
    <section className="py-8 md:py-12">
      <div className="container-custom">
        <h2 className="font-display text-xl md:text-2xl font-bold mb-6">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={category.href}
              className={cn(
                'group relative aspect-square overflow-hidden rounded-lg animate-fade-up',
                `animation-delay-${(index % 3) * 100}`
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover image-zoom"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
              <div className="absolute inset-0 flex items-end p-3 md:p-4">
                <h3 className="font-display text-lg md:text-xl font-bold text-background">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
