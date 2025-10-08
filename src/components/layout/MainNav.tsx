import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  BarChart3,
  Settings,
  Bell,
  User,
  LogOut,
  Home,
  Route,
  Users,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MainNavProps {
  userRole?: 'admin' | 'dispatcher' | 'driver';
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
  onLogout?: () => void;
}

const navigationItems = {
  admin: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Route Overview', href: '/route/1', icon: Route },
    { name: 'Performance Reports', href: '/reports', icon: BarChart3 },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Integrations', href: '/integrations', icon: Settings },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'About', href: '/about', icon: HelpCircle },
  ],
  dispatcher: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Route Overview', href: '/route/1', icon: Route },
    { name: 'Performance Reports', href: '/reports', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'About', href: '/about', icon: HelpCircle },
  ],
  driver: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Routes', href: '/route/1', icon: Route },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'About', href: '/about', icon: HelpCircle },
  ],
};

export function MainNav({ 
  userRole = 'dispatcher', 
  userName = 'User', 
  userAvatar,
  notificationCount = 0,
  onLogout 
}: MainNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentUserItems = navigationItems[userRole] || navigationItems.dispatcher;

  const handleLogout = () => {
    onLogout?.();
    navigate('/login');
  };

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    if (path.startsWith('/route/')) {
      return location.pathname.startsWith('/route/');
    }
    if (path === '/reports') {
      return location.pathname === '/reports';
    }
    if (path === '/admin/users') {
      return location.pathname === '/admin/users';
    }
    if (path === '/integrations') {
      return location.pathname === '/integrations';
    }
    if (path === '/settings') {
      return location.pathname === '/settings';
    }
    if (path === '/about') {
      return location.pathname === '/about';
    }
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">RouteIQ</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {currentUserItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                    isActivePath(item.href) && "bg-accent text-accent-foreground"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                )}
              </Button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-popover border rounded-md shadow-lg z-50"
                >
                  <div className="p-3 border-b">
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {userRole}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-3 py-2 text-sm hover:bg-accent"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-3 py-2 text-sm hover:bg-accent"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                    <div className="border-t my-1" />
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-accent"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {currentUserItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "group flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors",
                      isActivePath(item.href)
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}
