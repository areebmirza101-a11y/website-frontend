import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, Package, Tags, ShoppingCart, LogOut, Store, Settings, MessageCircle, Users, Sun, Moon, Ruler, Percent, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import AdminPageTitleContext from './AdminPageTitleContext';
import { Toaster } from 'react-hot-toast';

const nav = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/sales', label: 'Sales & Promos', icon: Percent },
  { to: '/admin/blogs', label: 'Blogs', icon: BookOpen },
  { to: '/admin/settings', label: 'General Settings', icon: Settings },
  { to: '/admin/home-settings', label: 'Home Settings', icon: LayoutDashboard },
  { to: '/admin/messages', label: 'Messages', icon: MessageCircle },
  { to: '/admin/size-guides', label: 'Size Guides', icon: Ruler },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageCircle },
];

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [pageTitle, setPageTitle] = useState('');
  const [headerActions, setHeaderActions] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <AdminPageTitleContext.Provider value={{ setPageTitle, setHeaderActions }}>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-100 flex transition-colors duration-300">
        <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col fixed inset-y-0 transition-colors duration-300 z-20">
          <div className="h-20 flex items-center px-6 border-b border-gray-800">
            <span className="font-bold text-xl tracking-[0.2em] text-white">Velmoras</span>
            <span className="ml-2 text-xs text-gray-500 uppercase tracking-wider">Admin</span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto minimal-scrollbar">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive ? 'bg-white text-gray-900 translate-x-2' : 'text-gray-400 hover:bg-gray-800 hover:text-white hover:translate-x-1'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="px-4 py-6 border-t border-gray-800 space-y-1">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-300">
              <Store className="h-5 w-5" /> View Store
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-300">
              <LogOut className="h-5 w-5" /> Log out
            </button>
          </div>
        </aside>

        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10 transition-colors duration-300">
            <h1 className="text-xl font-bold text-gray-900 transition-colors duration-300">
              {pageTitle}
            </h1>
            <div className="flex items-center gap-6">
              {headerActions}

              <div className="flex items-center gap-4 border-l border-gray-200 pl-6 ml-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 transition-colors duration-300">{user?.name}</p>
                  <p className="text-xs text-gray-500 transition-colors duration-300">{user?.email}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </header>
          <main className="p-8 flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500 text-gray-900">
            {children}
            <Outlet />
          </main>
        </div>
      </div>
    </AdminPageTitleContext.Provider>
  );
};

export default AdminLayout;
