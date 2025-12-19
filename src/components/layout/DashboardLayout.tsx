import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Leaf,
  Package,
  ShoppingBag,
  LayoutDashboard,
  Users,
  LogOut,
  Store,
  ClipboardList,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const farmerNav: NavItem[] = [
  { label: 'Dashboard', href: '/farmer', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'My Products', href: '/farmer/products', icon: <Package className="h-5 w-5" /> },
  { label: 'Orders', href: '/farmer/orders', icon: <ShoppingBag className="h-5 w-5" /> },
];

const buyerNav: NavItem[] = [
  { label: 'Marketplace', href: '/marketplace', icon: <Store className="h-5 w-5" /> },
  { label: 'My Orders', href: '/buyer/orders', icon: <ClipboardList className="h-5 w-5" /> },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Users', href: '/admin/users', icon: <Users className="h-5 w-5" /> },
  { label: 'Products', href: '/admin/products', icon: <Package className="h-5 w-5" /> },
  { label: 'Orders', href: '/admin/orders', icon: <ShoppingBag className="h-5 w-5" /> },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getNavItems = (): NavItem[] => {
    switch (user?.role) {
      case 'farmer': return farmerNav;
      case 'buyer': return buyerNav;
      case 'admin': return adminNav;
      default: return [];
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = getNavItems();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-border px-6">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">AgriConnect</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  location.pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-border p-4">
            <div className="mb-3 px-3">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
