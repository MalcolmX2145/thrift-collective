import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Share2, ShoppingBag, Check, Loader2, Minus, Plus } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { fetchProductById, fetchProducts } from '@/services/api';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem, isInCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore(); // Fixed: Hook moved here
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading: isLoadingProduct, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const similarProducts = product
    ? allProducts
      .filter(
        (p) =>
          p.id !== product.id &&
          (p.category === product.category || p.subCategory === product.subCategory) &&
          !p.isSold
      )
      .slice(0, 4)
    : [];

  const inCart = product ? isInCart(product.id) : false;

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container-custom py-16 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been sold.
          </p>
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  // useAuthStore is already called at the top of the component

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please log in to add items to your cart.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (product.sizes.length > 0 && !selectedSize) {
      toast({
        title: 'Please select a size',
        description: 'Choose a size before adding to cart.',
        variant: 'destructive',
      });
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize || product.sizes[0],
      quantity: quantity,
    });

    toast({
      title: 'Added to cart!',
      description: `${quantity}x ${product.name} has been added to your cart.`,
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: `Check out this ${product.name} from The Thrift Collective!`,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Product link has been copied to clipboard.',
      });
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-28 md:pb-8">
        {/* Breadcrumb */}
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/shop" className="hover:text-foreground transition-colors">
              Shop
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground truncate">{product.name}</span>
          </nav>
        </div>

        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover animate-fade-in"
                />

                {/* Image Navigation */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && <span className="badge-new">NEW</span>}
                  {product.isTrending && <span className="badge-trending">TRENDING</span>}
                  {product.isPremium && <span className="badge-premium">PREMIUM</span>}
                  {product.isSold && <span className="badge-sold">SOLD</span>}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={cn(
                        'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                        selectedImageIndex === index
                          ? 'border-primary'
                          : 'border-transparent hover:border-muted-foreground/30'
                      )}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {product.category}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {product.subCategory}
                  </span>
                </div>

                <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
                  {product.name}
                </h1>

                {product.brand && (
                  <p className="text-muted-foreground mb-2">by {product.brand}</p>
                )}

                <p className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </p>
              </div>

              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium',
                    product.condition === 'Like New'
                      ? 'bg-success/10 text-success'
                      : product.condition === 'Vintage'
                        ? 'bg-accent/20 text-accent-foreground'
                        : 'bg-muted text-muted-foreground'
                  )}
                >
                  {product.condition}
                </span>
                {product.stock_quantity === 1 && !product.isSold && (
                  <span className="badge-urgent flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-warning-foreground rounded-full animate-pulse" />
                    Only 1 left in stock!
                  </span>
                )}
              </div>

              {/* Size Selector */}
              {product.sizes.length > 0 && product.sizes[0] !== 'One Size' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          'px-4 py-2 border rounded-lg font-medium transition-colors',
                          selectedSize === size
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary'
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock_quantity > 0 ? (
                  <div className="flex items-center gap-2 text-success font-medium">
                    <span className="w-2 h-2 rounded-full bg-success"></span>
                    In Stock ({product.stock_quantity} available)
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-destructive font-medium">
                    <span className="w-2 h-2 rounded-full bg-destructive"></span>
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stock_quantity > 0 && (
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-3">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:border-primary hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="w-12 text-center font-medium text-lg">
                      {quantity}
                    </span>

                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      disabled={quantity >= product.stock_quantity}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:border-primary hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>

                    <span className="text-xs text-muted-foreground ml-2">
                      {product.stock_quantity} available
                    </span>
                  </div>
                </div>
              )}

              {/* Add to Cart - Desktop */}
              <div className="hidden md:flex gap-4">
                <Button
                  variant={inCart ? 'secondary' : 'cart'}
                  size="lg"
                  disabled={inCart || product.isSold || product.stock_quantity === 0}
                  onClick={handleAddToCart}
                  className="flex-1"
                >
                  {product.isSold ? (
                    'Sold Out'
                  ) : inCart ? (
                    <>
                      <Check className="h-5 w-5" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Button variant="outline" size="lg" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Accordion Sections */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description">
                  <AccordionTrigger>Description</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{product.description}</p>
                  </AccordionContent>
                </AccordionItem>

                {product.measurements && (
                  <AccordionItem value="measurements">
                    <AccordionTrigger>Measurements</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-muted-foreground">
                        {Object.entries(product.measurements).map(([key, value]) => (
                          <li key={key} className="flex justify-between">
                            <span className="capitalize">{key}:</span>
                            <span>{value}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}

                <AccordionItem value="shipping">
                  <AccordionTrigger>Shipping & Delivery</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 bg-success rounded-full" />
                        Same-day delivery (Nairobi CBD) - KES 300
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 bg-primary rounded-full" />
                        Next-day delivery (Greater Nairobi) - KES 250
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 bg-accent rounded-full" />
                        Pick up from shop - Free
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <section className="mt-12 md:mt-16">
              <h2 className="font-display text-xl md:text-2xl font-bold mb-6">
                You Might Also Like
              </h2>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-x-visible">
                {similarProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    className="flex-shrink-0 w-[160px] md:w-auto"
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Mobile Sticky Add to Cart */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-background border-t border-border z-40">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{product.name}</p>
            <p className="font-bold text-lg text-primary">{formatPrice(product.price)}</p>
          </div>
          <Button
            variant={inCart ? 'secondary' : 'default'}
            size="lg"
            onClick={handleAddToCart}
            disabled={inCart || product.isSold}
          >
            {product.isSold ? 'Sold' : inCart ? 'Added' : 'Add to Cart'}
          </Button>
        </div>
      </div>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
