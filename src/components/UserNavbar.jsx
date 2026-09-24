import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, Heart, LogOut, LayoutDashboard, Sun, Moon, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSales } from '../context/SalesContext';
import { categoryApi, settingsApi } from '../api';

const UserNavbar = () => {
  const { cartCount, toggleCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin, logout } = useAuth();
  const { activeSales } = useSales();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [logoUrl, setLogoUrl] = useState('/logo.png');
  const [companyName, setCompanyName] = useState('Velmoras');
  const navigate = useNavigate();

  useEffect(() => {
    categoryApi.list().then(setCategories).catch(() => { });
    settingsApi.getPublic().then(s => {
      if (s?.app_logo) setLogoUrl(s.app_logo);
      if (s?.company_name) setCompanyName(s.company_name);
    }).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-40 border-b border-gray-200 transition-colors duration-300">
      <div className="w-[90%] max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex-shrink-0 flex items-center">
            {logoUrl ? (
              <img src={logoUrl} alt={companyName} className="h-8 w-auto object-contain" />
            ) : (
              <span className="font-bold text-2xl tracking-[0.2em] text-ink transition-colors duration-300">{companyName.toUpperCase()}<span className="text-accent">.</span></span>
            )}
          </Link>

          <nav className="hidden md:flex space-x-8 items-center h-full">
            <Link to="/" className="text-gray-600 hover:text-accent font-medium transition-colors">Home</Link>
            
            {activeSales && activeSales.length > 0 && (
              <Link to="/products?on_sale=true" className="text-red-500 font-bold hover:text-red-600 transition-colors flex items-center gap-1">
                Sale <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">HOT</span>
              </Link>
            )}
            
            <div className="relative group h-full flex items-center">
              <Link to="/products" className="text-gray-600 group-hover:text-accent font-medium transition-colors flex items-center gap-1 h-full">
                Shop All <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
              </Link>
              
              <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[600px] bg-white shadow-2xl shadow-black/10 border border-gray-100 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top -translate-y-2 group-hover:translate-y-0 z-50">
                <div className="p-8 grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-5">Categories</h3>
                    <ul className="space-y-4">
                      {safeCategories.filter(c => !c.parent_id).slice(0, 5).map(cat => (
                        <li key={cat.id}>
                          <Link to={`/products?category=${cat.slug}`} className="text-gray-700 hover:text-accent font-medium transition-colors flex items-center justify-between group/link text-sm">
                            {cat.name}
                            <span className="opacity-0 group-hover/link:opacity-100 transform -translate-x-2 group-hover/link:translate-x-0 transition-all text-accent">→</span>
                          </Link>
                        </li>
                      ))}
                      <li className="pt-2">
                        <Link to="/products" className="text-accent font-bold text-sm hover:underline inline-block">View All Categories</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-[#F7F5F0] rounded-xl p-6 flex flex-col justify-center items-center text-center">
                    <span className="bg-[#BA9B74] text-white text-[10px] font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">Featured</span>
                    <h4 className="font-bold text-xl text-ink mb-2">New Arrivals</h4>
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">Discover the latest additions to our premium collection.</p>
                    <Link to="/products?sort=newest" className="bg-[#BA9B74] text-white px-6 py-2.5 rounded-full text-sm font-bold tracking-widest hover:bg-[#A68A61] transition-colors">
                      SHOP NOW
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link to="/about" className="text-gray-600 hover:text-accent font-medium transition-colors">About</Link>
            <Link to="/blogs" className="text-gray-600 hover:text-accent font-medium transition-colors">Journal</Link>
            <Link to="/contact" className="text-gray-600 hover:text-accent font-medium transition-colors">Contact</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-5">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                placeholder="Search apparel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 pl-10 pr-4 py-2 rounded-full bg-gray-100 border-transparent focus:bg-white focus:border-accent focus:ring-0 transition-all text-sm outline-none border text-gray-900"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-accent transition-colors" />
            </form>

            {isAdmin && (
              <Link to="/admin" title="Admin panel" className="text-gray-600 hover:text-accent transition-colors">
                <LayoutDashboard className="h-5 w-5" />
              </Link>
            )}

            {user ? (
              <Link to="/profile" title="Profile" className="text-gray-600 hover:text-accent transition-colors">
                <User className="h-5 w-5" />
              </Link>
            ) : (
              <Link to="/login" title="Sign in" className="text-gray-600 hover:text-accent transition-colors">
                <User className="h-5 w-5" />
              </Link>
            )}

            <Link to="/wishlist" className="text-gray-600 hover:text-accent transition-colors relative">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button onClick={toggleCart} className="text-gray-600 hover:text-accent transition-colors relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center md:hidden space-x-4">

            <Link to="/wishlist" className="text-gray-700 relative">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button onClick={toggleCart} className="text-gray-700 relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 hover:text-gray-900">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-4 shadow-lg absolute w-full">
          <form onSubmit={handleSearch} className="relative mt-2">
            <input
              type="text"
              placeholder="Search apparel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 border-none outline-none"
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </form>
          <div className="flex flex-col space-y-4 pt-2">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium text-lg">Home</Link>
            {activeSales && activeSales.length > 0 && (
              <Link to="/products?on_sale=true" onClick={() => setIsMobileMenuOpen(false)} className="text-red-500 font-bold text-lg flex items-center gap-2">
                Sale <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">HOT</span>
              </Link>
            )}
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium text-lg">Shop All</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium text-lg">About</Link>
            <Link to="/blogs" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium text-lg">Journal</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium text-lg">Contact</Link>
            {user && (
              <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium text-lg">My Orders</Link>
            )}
            {isAdmin && <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium text-lg">Admin Panel</Link>}
            {user ? (
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-left text-gray-800 font-medium text-lg">My Profile</Link>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium text-lg">Sign in</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default UserNavbar;
