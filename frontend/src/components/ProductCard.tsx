import { Link } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/stores/cartStore';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem, isInCart } = useCartStore();
  const { toast } = useToast();
  const inCart = isInCart(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inCart && !product.isSold) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: product.sizes[0],
      });
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const formatPrice = (price: number) => {
    return `KES ${price.toLocaleString()}`;
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className={cn(
        'group block bg-card rounded-lg overflow-hidden card-hover',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover image-zoom"
          loading="lazy"
        />

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && <span className="badge-new">NEW</span>}
          {product.isTrending && <span className="badge-trending">TRENDING</span>}
          {product.isPremium && <span className="badge-premium">PREMIUM</span>}
          {product.isSold && <span className="badge-sold">SOLD</span>}
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            disabled={inCart || product.isSold}
            className={cn(
              'p-2 rounded-full shadow-lg transition-colors',
              inCart || product.isSold
                ? 'bg-muted text-muted-foreground'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
            aria-label={inCart ? 'In cart' : 'Add to cart'}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
          <button
            className="p-2 bg-background text-foreground rounded-full shadow-lg hover:bg-muted transition-colors"
            aria-label="Quick view"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>

        {/* Only 1 Left Badge */}
        {!product.isSold && (
          <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="badge-urgent">Only 1 left!</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 md:p-4">
        <h3 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="font-bold text-base text-primary">
            {formatPrice(product.price)}
          </p>
          <span className="text-xs text-muted-foreground">{product.condition}</span>
        </div>
      </div>
    </Link>
  );
}
