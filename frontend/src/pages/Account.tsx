import { Link, useNavigate } from 'react-router-dom';
import { User, Package, LogOut, Settings, Heart } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';

export default function Account() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container-custom py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">
              Sign in to your account
            </h1>
            <p className="text-muted-foreground mb-8">
              Access your orders, wishlist, and more
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/signup">Create Account</Link>
              </Button>
            </div>
          </div>
        </main>

        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  const menuItems = [
    {
      icon: Package,
      title: 'My Orders',
      description: 'Track and view your orders',
      href: '/orders',
    },
    {
      icon: Heart,
      title: 'Wishlist',
      description: 'Items you saved for later',
      href: '/wishlist',
    },
    {
      icon: Settings,
      title: 'Account Settings',
      description: 'Update your profile and preferences',
      href: '/settings',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-20 md:pb-8">
        <div className="container-custom py-8">
          {/* User Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">{user?.name}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {/* Admin Badge */}
          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              className="block mb-6 p-4 bg-secondary/20 border border-secondary rounded-lg hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-secondary-foreground">
                    Admin Dashboard
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Manage products and orders
                  </p>
                </div>
                <span className="badge-premium">ADMIN</span>
              </div>
            </Link>
          )}

          {/* Menu Items */}
          <div className="space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  to={item.href}
                  className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="p-2 bg-muted rounded-full">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Logout Button */}
          <div className="mt-8">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full md:w-auto"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
