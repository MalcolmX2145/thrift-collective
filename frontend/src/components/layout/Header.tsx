import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User, Shield } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/mode-toggle';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'New Arrivals', href: '/shop?collection=new-arrivals' },
  { name: 'Deals', href: '/shop?collection=deals' },
];

export function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const { user, isAuthenticated } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 -ml-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src="/thriftpic-removebg-preview.png"
                alt="The Thrift Collective"
                className="h-14 md:h-20 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              // Parse link and location
              const [linkPath, linkQuery] = link.href.split('?');
              const linkParams = new URLSearchParams(linkQuery);
              const locationParams = new URLSearchParams(location.search);

              let isActive = false;

              if (link.href === '/') {
                isActive = location.pathname === '/';
              } else if (location.pathname === linkPath) {
                // If paths match, check params
                const linkParamEntries = Array.from(linkParams.entries());

                if (linkParamEntries.length === 0) {
                  // Generic link (e.g. /shop) - active only if no specific collection is selected (or collection=all)
                  const currentCollection = locationParams.get('collection');
                  isActive = !currentCollection || currentCollection === 'all';
                } else {
                  // Specific link (e.g. /shop?collection=x) - active if all params match
                  isActive = linkParamEntries.every(
                    ([key, val]) => locationParams.get(key) === val
                  );
                }
              }

              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors link-underline",
                    isActive ? "text-foreground font-semibold link-underline-active" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <ModeToggle />

            {/* Admin Button - Only show for the specific admin user */}
            {isAuthenticated && user?.role === 'ADMIN' && user?.email === 'admin@thriftcollective.com' && (
              <Link
                to="/admin"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              to={isAuthenticated ? "/account" : "/login"}
              className="hidden md:flex p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Account"
            >
              {isAuthenticated && user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5" />
              )}
            </Link>

            <Link to="/cart" className="relative p-2 hover:bg-muted rounded-full transition-colors">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold rounded-full animate-scale-in">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar (Expandable) */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300',
            isSearchOpen ? 'max-h-20 pb-4' : 'max-h-0'
          )}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for jackets, sneakers, bags..."
              className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden fixed inset-x-0 top-16 bg-background border-b border-border transition-all duration-300',
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        )}
      >
        <nav className="container-custom py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="block py-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/account"
            className="block py-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            My Account
          </Link>
          {isAuthenticated && user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-3 text-lg font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Shield className="h-5 w-5" />
              Admin Panel
            </Link>
          )}
        </nav>
      </div>
    </header >
  );
}
