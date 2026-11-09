import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Lock, Shield, LogOut, Package, 
  Heart, CheckCircle2, ChevronRight, Eye, ShoppingBag, 
  Trash2, AlertCircle, Loader2, ArrowRight, ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { authApi, orderApi } from '../api';
import { assetUrl } from '../api/client';
import { money } from '../lib/format';
import Seo from '../components/Seo';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { user, logout, updateUser, isAdmin } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab: 'info' | 'orders' | 'wishlist'
  const activeTab = searchParams.get('tab') || 'info';
  const setActiveTab = (tab) => setSearchParams({ tab });

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'Pakistan',
  });

  // Password Change State
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Saving State
  const [saving, setSaving] = useState(false);

  // Sync user state & load shipping preferences from local storage
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setName(user.name || '');
    try {
      const savedPrefs = localStorage.getItem(`velmoras_user_prefs_${user.id}`);
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.address) setAddress(parsed.address);
      }
    } catch (e) {
      console.error(e);
    }
  }, [user, navigate]);

  // Load orders when 'orders' tab is active
  useEffect(() => {
    if (!user || activeTab !== 'orders') return;
    setLoadingOrders(true);
    orderApi.listMine()
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('Failed to load orders', err);
        setOrders([]);
      })
      .finally(() => setLoadingOrders(false));
  }, [user, activeTab]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Signed out successfully');
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    if (showPasswordChange && newPassword) {
      if (!currentPassword) {
        toast.error('Please enter your current password');
        return;
      }
      if (newPassword.length < 6) {
        toast.error('New password must be at least 6 characters');
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }
    }

    setSaving(true);
    try {
      const payload = { name: name.trim() };
      if (showPasswordChange && newPassword) {
        payload.current_password = currentPassword;
        payload.new_password = newPassword;
      }

      const res = await authApi.updateProfile(payload);
      if (res?.user) {
        updateUser(res.user);
      }

      // Save phone and address to user preferences for checkout auto-fill
      localStorage.setItem(
        `velmoras_user_prefs_${user.id}`,
        JSON.stringify({ phone, address })
      );

      toast.success('Profile updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordChange(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleMoveToCart = (item) => {
    addToCart(item, {
      size: item.sizes?.[0] || 'Standard',
      color: item.colors?.[0] || 'Default',
      quantity: 1,
    });
    toast.success(`${item.name} added to cart!`);
  };

  const statusStyles = {
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="bg-secondary/30 min-h-screen pt-28 pb-20">
      <Seo 
        title="My Account" 
        description="Manage your Velmoras Creation account details, view recent orders, and inspect your wishlist."
      />

      <div className="w-[90%] max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted mb-2 font-semibold">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-ink">My Account</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">Account Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Modern User Sidebar */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* User Profile Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-border/60 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#997F64] to-[#BA9B74] text-white flex items-center justify-center text-2xl font-black shadow-md shadow-[#BA9B74]/20 shrink-0">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-ink truncate">{user.name}</h2>
                    {isAdmin && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/20">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted truncate mt-0.5 flex items-center gap-1.5 font-mono">
                    <Mail className="h-3.5 w-3.5 text-muted/80 shrink-0" /> {user.email}
                  </p>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="mt-6 pt-6 border-t border-border/40 space-y-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('info')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'info'
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted hover:bg-secondary/70 hover:text-ink'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <User className="h-4 w-4" /> Personal Information
                  </span>
                  <ChevronRight className={`h-4 w-4 transition-transform ${activeTab === 'info' ? 'translate-x-0.5' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted hover:bg-secondary/70 hover:text-ink'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Package className="h-4 w-4" /> My Orders
                  </span>
                  <div className="flex items-center gap-2">
                    {orders.length > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-secondary text-ink'
                      }`}>
                        {orders.length}
                      </span>
                    )}
                    <ChevronRight className={`h-4 w-4 transition-transform ${activeTab === 'orders' ? 'translate-x-0.5' : ''}`} />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'wishlist'
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted hover:bg-secondary/70 hover:text-ink'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Heart className="h-4 w-4" /> My Wishlist
                  </span>
                  <div className="flex items-center gap-2">
                    {wishlistItems.length > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        activeTab === 'wishlist' ? 'bg-white/20 text-white' : 'bg-secondary text-ink'
                      }`}>
                        {wishlistItems.length}
                      </span>
                    )}
                    <ChevronRight className={`h-4 w-4 transition-transform ${activeTab === 'wishlist' ? 'translate-x-0.5' : ''}`} />
                  </div>
                </button>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold text-accent hover:bg-accent/10 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <Shield className="h-4 w-4" /> Admin Panel
                    </span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
              </div>

              {/* Logout Button */}
              <div className="mt-6 pt-6 border-t border-border/40">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>

            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Tab Content Area */}
          {/* ======================================================== */}
          <div className="lg:col-span-8">
            
            {/* ---------------------------------------------------- */}
            {/* TAB 1: Personal Information */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'info' && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-border/60 shadow-xs space-y-8 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-2xl font-bold text-ink">Personal Information</h2>
                  <p className="text-sm text-muted mt-1">Manage your account details and default delivery address.</p>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-6">
                  
                  {/* Basic Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-ink text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>

                    {/* Email (PERMANENTLY LOCKED) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                          Email Address
                        </label>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted bg-secondary px-2 py-0.5 rounded-md">
                          <Lock className="h-3 w-3" /> Locked
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="email"
                          disabled
                          value={user.email}
                          className="w-full px-4 py-3 bg-gray-100/80 border border-gray-200 rounded-xl text-gray-500 text-sm cursor-not-allowed outline-none select-none"
                        />
                      </div>
                      <p className="text-[11px] text-muted mt-1.5">
                        Email address cannot be modified for account verification & security.
                      </p>
                    </div>

                    {/* Phone Number */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2">
                        Phone / WhatsApp (For Delivery Updates)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +92 300 1234567"
                        className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-ink text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>

                  </div>

                  {/* Shipping Address Section */}
                  <div className="pt-6 border-t border-border/40">
                    <h3 className="text-base font-bold text-ink mb-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" /> Default Shipping Address
                    </h3>
                    <p className="text-xs text-muted mb-4">This will be pre-filled when you proceed to checkout.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Street Address</label>
                        <input
                          type="text"
                          value={address.street}
                          onChange={(e) => setAddress({ ...address, street: e.target.value })}
                          placeholder="House / Apartment #, Street name"
                          className="w-full px-4 py-2.5 bg-secondary/30 border border-border rounded-xl text-ink text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">City</label>
                        <input
                          type="text"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          placeholder="City"
                          className="w-full px-4 py-2.5 bg-secondary/30 border border-border rounded-xl text-ink text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Postal / Zip Code</label>
                        <input
                          type="text"
                          value={address.zip}
                          onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                          placeholder="e.g. 51310"
                          className="w-full px-4 py-2.5 bg-secondary/30 border border-border rounded-xl text-ink text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Country</label>
                        <input
                          type="text"
                          value={address.country}
                          onChange={(e) => setAddress({ ...address, country: e.target.value })}
                          placeholder="Country"
                          className="w-full px-4 py-2.5 bg-secondary/30 border border-border rounded-xl text-ink text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Change Option */}
                  <div className="pt-6 border-t border-border/40">
                    <button
                      type="button"
                      onClick={() => setShowPasswordChange(!showPasswordChange)}
                      className="text-xs font-bold uppercase tracking-wider text-primary hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      {showPasswordChange ? 'Cancel Password Change' : 'Change Password?'}
                    </button>

                    {showPasswordChange && (
                      <div className="mt-4 p-5 rounded-2xl bg-secondary/40 border border-border/60 space-y-4 animate-in fade-in duration-200">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Current Password</label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter your current password"
                            className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="At least 6 characters"
                              className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Repeat new password"
                              className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-xl hover:bg-primary-hover hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      {saving ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Saving Changes...</>
                      ) : (
                        <><CheckCircle2 className="h-4 w-4" /> Save Profile Details</>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TAB 2: My Orders */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-border/60 shadow-xs space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-ink">My Orders</h2>
                    <p className="text-sm text-muted mt-1">Review and track your recent orders.</p>
                  </div>
                  <Link
                    to="/products"
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent hover:underline"
                  >
                    Shop More <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {loadingOrders ? (
                  <div className="space-y-4 py-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-secondary/40 rounded-2xl p-6 h-28 animate-pulse border border-border/40" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 bg-secondary/30 rounded-2xl border border-dashed border-border/80 p-8">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted mx-auto mb-4">
                      <Package className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-ink mb-1">No Orders Placed Yet</h3>
                    <p className="text-sm text-muted max-w-sm mx-auto mb-6">
                      Explore our handcrafted movie costumes, tunics and custom apparel to place your first order.
                    </p>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:bg-primary-hover shadow-sm transition-all"
                    >
                      <ShoppingBag className="h-4 w-4" /> Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((o) => (
                      <div
                        key={o.id}
                        className="bg-secondary/25 hover:bg-secondary/40 border border-border/60 rounded-2xl p-5 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-ink text-base">Order #{o.id}</span>
                              <span
                                className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                                  statusStyles[o.status] || 'bg-gray-100 text-gray-700 border-gray-200'
                                }`}
                              >
                                {o.status}
                              </span>
                            </div>
                            <p className="text-xs text-muted mt-1">
                              Placed on {new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xs text-muted font-medium">Total Amount</p>
                              <p className="text-base font-bold text-ink">{money(o.total)}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(selectedOrder?.id === o.id ? null : o)}
                              className="px-3.5 py-2 rounded-xl bg-white border border-border text-xs font-semibold text-ink hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              {selectedOrder?.id === o.id ? 'Hide Details' : 'View Details'}
                            </button>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        {selectedOrder?.id === o.id && (
                          <div className="pt-4 space-y-3 animate-in fade-in duration-200">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted">Items in this order:</h4>
                            <div className="divide-y divide-border/40 bg-white rounded-xl border border-border/50 p-3">
                              {(o.items || []).map((item, idx) => (
                                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted font-bold overflow-hidden border border-border/40">
                                      {item.image ? (
                                        <img src={assetUrl(item.image)} alt="" className="w-full h-full object-contain" />
                                      ) : (
                                        <Package className="h-4 w-4" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-ink">{item.product_name || `Product #${item.product_id}`}</p>
                                      <p className="text-muted">
                                        Qty: {item.quantity} {item.size ? `· Size: ${item.size}` : ''} {item.color ? `· Color: ${item.color}` : ''}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="font-bold text-ink">{money((item.price || 0) * (item.quantity || 1))}</span>
                                </div>
                              ))}
                            </div>
                            {o.shipping_address && (
                              <p className="text-xs text-muted pt-1">
                                <span className="font-semibold text-ink">Shipping to:</span> {o.shipping_address}, {o.shipping_city} {o.shipping_country}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TAB 3: My Wishlist */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-border/60 shadow-xs space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-ink">My Wishlist</h2>
                    <p className="text-sm text-muted mt-1">Saved items you are considering for purchase.</p>
                  </div>
                  {wishlistItems.length > 0 && (
                    <span className="text-xs font-semibold text-muted bg-secondary px-3 py-1 rounded-full">
                      {wishlistItems.length} Saved {wishlistItems.length === 1 ? 'Item' : 'Items'}
                    </span>
                  )}
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="text-center py-16 bg-secondary/30 rounded-2xl border border-dashed border-border/80 p-8">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted mx-auto mb-4">
                      <Heart className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-ink mb-1">Your Wishlist is Empty</h3>
                    <p className="text-sm text-muted max-w-sm mx-auto mb-6">
                      Explore our collections and tap the heart icon on any outfit to save it here for later.
                    </p>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:bg-primary-hover shadow-sm transition-all"
                    >
                      <ShoppingBag className="h-4 w-4" /> Browse Collections
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {wishlistItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-secondary/25 hover:bg-secondary/40 border border-border/60 rounded-2xl p-4 flex flex-col justify-between transition-all group"
                      >
                        <div className="flex gap-4">
                          <Link to={`/products/${item.slug || item.id}`} className="shrink-0 w-24 h-28 bg-white rounded-xl overflow-hidden border border-border/50 p-1 flex items-center justify-center">
                            <img
                              src={item.images?.[0]?.url ? assetUrl(item.images[0].url) : item.image || 'https://via.placeholder.com/150'}
                              alt={item.name}
                              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                            />
                          </Link>
                          <div className="min-w-0 flex-1 flex flex-col justify-between">
                            <div>
                              <Link
                                to={`/products/${item.slug || item.id}`}
                                className="font-bold text-sm text-ink hover:text-primary transition-colors line-clamp-2"
                              >
                                {item.name}
                              </Link>
                              <p className="text-sm font-extrabold text-ink mt-1.5">{money(item.price)}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromWishlist(item.id)}
                              className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium transition-colors self-start cursor-pointer pt-2"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Remove
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-border/40">
                          <button
                            type="button"
                            onClick={() => handleMoveToCart(item)}
                            className="w-full bg-primary text-primary-foreground text-xs font-semibold py-2.5 px-4 rounded-xl hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" /> Move to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default UserProfile;
