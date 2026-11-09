import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { categoryApi, newsletterApi } from '../api';
import { Sparkles, Mail, Loader2, Check, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';

const UserFooter = () => {
  const { settings } = useSettings();
  const companyName = settings?.company_name || 'Velmoras Creation';
  const logoUrl = settings?.app_logo || '/logo.png';
  const [categories, setCategories] = useState([]);

  // Newsletter State
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubmitting(true);
    try {
      const res = await newsletterApi.subscribe(email);
      setSubscribed(true);
      toast.success(res.message || 'Welcome to VIP Club! 10% coupon sent.');
    } catch (err) {
      toast.error(err.message || 'Subscription failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyPromoCode = () => {
    navigator.clipboard?.writeText('WELCOME10');
    setCopied(true);
    toast.success('Promo code "WELCOME10" copied!');
    setTimeout(() => setCopied(false), 2500);
  };

  let socials = [];
  try {
    socials = typeof settings?.social_links === 'string' ? JSON.parse(settings.social_links) : (settings?.social_links || []);
  } catch (e) {
    socials = [];
  }

  useEffect(() => {
    categoryApi.listWithSubs().then(setCategories).catch(() => {});
  }, []);

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-auto">
      <div className="w-[90%] max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* VIP Newsletter Club Banner */}
        <div className="mb-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-gray-900 via-[#181f2a] to-gray-950 text-white border border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#BA9B74]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#BA9B74]/20 border border-[#BA9B74]/30 text-[#BA9B74] text-[11px] font-black uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5" /> VIP Collectors Club
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                Join the Inner Circle & Save 10%
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Subscribe for private costume drops, screen-accurate fabric releases, and receive an instant 10% welcome coupon.
              </p>
            </div>

            <div className="w-full lg:w-auto lg:min-w-[420px]">
              {subscribed ? (
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-[#BA9B74]/40 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#BA9B74] text-white flex items-center justify-center font-black">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-[#BA9B74]">You're in!</p>
                      <p className="text-xs text-white">Use code <span className="font-mono font-bold text-[#BA9B74]">WELCOME10</span> for 10% off.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={copyPromoCode}
                    className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 text-xs font-medium focus:outline-none focus:border-[#BA9B74] focus:ring-1 focus:ring-[#BA9B74] transition backdrop-blur-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3.5 rounded-2xl bg-[#BA9B74] text-white font-black text-xs uppercase tracking-widest hover:bg-[#a58863] transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Claim 10%'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-12">
          <div className="md:col-span-4 lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              {logoUrl && (
                <img src={logoUrl} alt={companyName} className="h-12 w-auto object-contain rounded-full border border-gray-100/50 shadow-sm" />
              )}
              <span className="font-bold text-base md:text-lg tracking-widest text-ink">{companyName.toUpperCase()}<span className="text-accent">.</span></span>
            </div>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">
              Master creators of screen-accurate cinema costumes, custom cosplay outfits, and bespoke tailoring — crafted with precision and shipped worldwide.
            </p>
            <div className="flex flex-wrap gap-4">
              {socials.map((social, idx) => (
                <a key={idx} href={social.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-gray-400 hover:text-accent transition-colors">
                  {social.label.toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 lg:col-start-7 lg:col-span-2">
            <h4 className="font-semibold text-ink mb-4">Shop</h4>
            <ul className="space-y-3">
              <li><Link to="/products" className="text-gray-500 hover:text-accent text-sm transition-colors">All Products</Link></li>
              {categories.filter(c => !c.parent_id).map(c => (
                <li key={c.id}>
                  <Link to={`/products?category=${c.slug}`} className="text-gray-500 hover:text-accent text-sm transition-colors">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="font-semibold text-ink mb-4">Customer Care</h4>
            <ul className="space-y-3">
              <li><Link to="/size-guide" className="text-gray-500 hover:text-accent text-sm transition-colors">Size Guide</Link></li>
              <li><Link to="/shipping" className="text-gray-500 hover:text-accent text-sm transition-colors">Shipping &amp; Returns</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-accent text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="font-semibold text-ink mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-gray-500 hover:text-accent text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-accent text-sm transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link to="/returns" className="text-gray-500 hover:text-accent text-sm transition-colors">Return &amp; Refund</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Velmoras Creation. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link to="/privacy" className="text-gray-400 text-xs hover:text-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 text-xs hover:text-accent transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;
