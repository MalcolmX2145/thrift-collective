import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroBanner from '@/assets/hero-banner.jpg';

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="The Thrift Collective - Curated secondhand fashion"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="max-w-xl animate-fade-up">
          <span className="inline-block text-primary font-medium text-sm md:text-base mb-3 animate-slide-in">
            Nairobi's Curated Secondhand Fashion
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-4 leading-tight">
            Discover Unique <br />
            <span className="text-primary">Thrift</span> Pieces
          </h1>
          <p className="text-background/80 text-base md:text-lg mb-8 max-w-md">
            One-of-a-kind vintage finds, designer pieces, and sustainable fashion. 
            Each item tells a story. Find yours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="hero" size="xl">
              <Link to="/shop">Shop Unique Pieces</Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="bg-background/10 border-background/20 text-background hover:bg-background/20 hover:text-background">
              <Link to="/shop?collection=new-arrivals">New Arrivals</Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-background/20">
            <div className="flex items-center gap-2 text-background/70 text-sm">
              <span className="h-2 w-2 bg-success rounded-full"></span>
              Same-day Delivery in Nairobi
            </div>
            <div className="flex items-center gap-2 text-background/70 text-sm">
              <span className="h-2 w-2 bg-primary rounded-full"></span>
              M-Pesa Payment
            </div>
            <div className="flex items-center gap-2 text-background/70 text-sm">
              <span className="h-2 w-2 bg-accent rounded-full"></span>
              All Items Quality Checked
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
