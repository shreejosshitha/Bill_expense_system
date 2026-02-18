import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Building2,
  LayoutDashboard,
  FileText,
  Upload,
  Bell,
  User,
  Users,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Package,
  FileCheck,
  Shield,
  Activity,
} from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const { notifications } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation items based on role
  const getNavigationItems = () => {
    switch (user?.role) {
      case 'employee':
        return [
          { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
          { name: 'Submit Bill', icon: Upload, path: '/submit-bill' },
          { name: 'My Bills', icon: FileText, path: '/my-bills' },
          { name: 'Notifications', icon: Bell, path: '/notifications' },
          { name: 'Profile', icon: User, path: '/profile' },
        ];
      case 'accounts':
        return [
          { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
          { name: 'Pending Bills', icon: FileCheck, path: '/pending-bills' },
          { name: 'All Bills', icon: FileText, path: '/all-bills' },
          { name: 'High Risk Bills', icon: AlertTriangle, path: '/high-risk-bills' },
          { name: 'Vendor Management', icon: Package, path: '/vendor-management' },
          { name: 'Reports', icon: BarChart3, path: '/reports' },
          { name: 'Profile', icon: User, path: '/profile' },
        ];
      case 'manager':
        return [
          { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
          { name: 'Pending Approvals', icon: FileCheck, path: '/pending-approvals' },
          { name: 'High Amount Bills', icon: AlertTriangle, path: '/high-amount-bills' },
          { name: 'Risk Alerts', icon: Shield, path: '/risk-alerts' },
          { name: 'Reports', icon: BarChart3, path: '/reports' },
          { name: 'Profile', icon: User, path: '/profile' },
        ];
      case 'admin':
        return [
          { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
          { name: 'User Management', icon: Users, path: '/user-management' },
          { name: 'Vendor Management', icon: Package, path: '/vendor-management' },
          { name: 'Approval Policy', icon: Settings, path: '/approval-policy' },
          { name: 'All Bills', icon: FileText, path: '/all-bills' },
          { name: 'Analytics', icon: BarChart3, path: '/analytics' },
          { name: 'System Logs', icon: Activity, path: '/system-logs' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavigationItems();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 lg:translate-x-0 lg:static`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">SmartExpense</h1>
              <p className="text-xs text-gray-500">AI Bill Approval</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {user?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Link to="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {user?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
