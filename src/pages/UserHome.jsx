import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Award, Gem } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productApi, categoryApi, settingsApi } from '../api';
import { apiFetch, assetUrl } from '../api/client';
import { useSales } from '../context/SalesContext';

const heroImg = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=2000&h=1000&fit=crop';
const catImg = {
  men: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&h=1000&fit=crop',
  women: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop',
  kids: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&h=1000&fit=crop',
  accessories: 'https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=800&h=1000&fit=crop',
};

const UserHome = () => {
  const [featured, setFeatured] = useState([]);
  const [heroProducts, setHeroProducts] = useState([]);
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const { activeSales, getCategorySale } = useSales();
  
  // Form State for Inquiry
  const [inquiry, setInquiry] = useState({ name: '', email: '', message: '' });
  const [inquiryStatus, setInquiryStatus] = useState('');

  useEffect(() => {
    productApi.list({ featured: true, limit: 4 }).then((d) => setFeatured(d.products)).catch(() => { });
    productApi.list({ show_in_hero: true, limit: 5 }).then((d) => setHeroProducts(d.products)).catch(() => { });
    categoryApi.listWithSubs().then(setCategories).catch(() => { });
    settingsApi.getPublic().then(setSettings).catch(() => { });
    apiFetch('/testimonials').then(setTestimonials).catch(() => { });
  }, []);

  useEffect(() => {
    if (heroProducts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % heroProducts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroProducts.length]);

  const heroTitle = settings?.hero_title || 'Wear the standard\nyou\'re proud of.';
  const heroSubtitle = settings?.hero_subtitle || 'Responsibly sourced, precisely cut apparel built to last. Discover pieces designed to move with you.';
  const heroCta = settings?.cta_text || 'Shop the Collection';
  const heroLink = settings?.cta_link || '/products';
  const heroImage = settings?.hero_bg || heroImg;

  // Find a global sale or any sale with a banner, fallback to the first active sale
  const saleBanner = activeSales.find(s => s.banner_image_url || s.banner_title) || activeSales[0];

  const handleInquiry = async (e) => {
    e.preventDefault();
    setInquiryStatus('sending');
    try {
      await apiFetch('/contact', { method: 'POST', body: { ...inquiry, subject: 'Wholesale / Custom Orders Inquiry' } });
      setInquiryStatus('success');
      setInquiry({ name: '', email: '', message: '' });
      import('react-hot-toast').then(({ default: toast }) => toast.success('Inquiry sent successfully!'));
    } catch(err) {
      setInquiryStatus('error');
      import('react-hot-toast').then(({ default: toast }) => toast.error('Failed to send inquiry. Please try again.'));
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen lg:min-h-[600px] lg:h-[85vh] flex items-center overflow-hidden bg-white pt-24 pb-12 lg:py-0">
        <div className="relative w-[90%] max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-full z-10">
          {heroProducts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full items-center gap-12 lg:gap-8">
              {/* Text Column */}
              <div className="max-w-xl z-10 pl-0 lg:pl-10 text-center lg:text-left mx-auto lg:mx-0 mt-8 lg:mt-0">
                <span className="inline-block bg-[#EBE7DF] text-[#A68A61] font-bold tracking-[0.05em] text-[11px] uppercase px-3 py-1.5 mb-6">
                  NEW ARRIVAL...
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-[5rem] font-bold tracking-tight text-[#2D2D2D] leading-[1.1] mb-6 whitespace-pre-line">
                  {heroTitle}
                </h1>
                <p className="text-[15px] text-[#7A7A7A] leading-[1.7] mb-10 max-w-[400px] mx-auto lg:mx-0">
                  {heroSubtitle}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    to={`/products/${heroProducts[currentHeroIdx].slug}`}
                    className="inline-flex items-center justify-center w-full sm:w-auto bg-[#BA9B74] text-white px-8 py-3.5 rounded-full font-medium text-[13px] tracking-widest hover:bg-[#A68A61] transition-all shadow-sm hover:shadow-md"
                  >
                    {heroCta.toUpperCase()}
                  </Link>
                  <Link
                    to={`/products/${heroProducts[currentHeroIdx].slug}`}
                    className="inline-flex items-center justify-center w-full sm:w-auto text-[#BA9B74] bg-white px-8 py-3.5 rounded-full border border-[#BA9B74] font-medium text-[13px] tracking-widest hover:bg-[#BA9B74]/10 transition-all"
                  >
                    VIEW DETAILS
                  </Link>
                </div>
              </div>

              {/* Product Column */}
              <div className="relative h-full flex items-center justify-center mt-4 lg:mt-0 pb-8 lg:pb-0">
                
                <div className="relative w-64 h-64 sm:w-[320px] sm:h-[320px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] bg-[#E1D0BC] rounded-full overflow-hidden flex items-center justify-center z-10 shadow-xl">
                  {heroProducts[currentHeroIdx].images && heroProducts[currentHeroIdx].images.length > 0 ? (
                    <img 
                      key={heroProducts[currentHeroIdx].id}
                      src={assetUrl(heroProducts[currentHeroIdx].images.find(i => i.is_main)?.url || heroProducts[currentHeroIdx].images[0].url)} 
                      alt={heroProducts[currentHeroIdx].name} 
                      className="w-full h-full object-contain mix-blend-multiply p-6 sm:p-8 transition-transform duration-700 ease-out hover:scale-105"
                    />
                  ) : (
                     <img src={heroImage} alt="Placeholder" className="w-full h-full object-contain mix-blend-multiply p-6 sm:p-8" />
                  )}
                </div>

                {/* Slider Dots */}
                {heroProducts.length > 1 && (
                  <div className="absolute bottom-[-20px] lg:bottom-auto lg:right-[-10px] lg:top-1/2 lg:transform lg:-translate-y-1/2 flex flex-row lg:flex-col gap-2.5 z-30 justify-center w-full lg:w-auto">
                    {heroProducts.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentHeroIdx(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentHeroIdx ? 'bg-[#997F64]' : 'bg-[#D1C6BA] hover:bg-[#A68A61]'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Fallback Hero if no show_in_hero products */
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full items-center gap-12 lg:gap-8">
               <div className="max-w-xl z-10 pl-0 lg:pl-10 text-center lg:text-left mx-auto lg:mx-0 mt-8 lg:mt-0">
                <span className="inline-block bg-[#EBE7DF] text-[#A68A61] font-bold tracking-[0.05em] text-[11px] uppercase px-3 py-1.5 mb-6">
                  NEW ARRIVAL...
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-[5rem] font-bold tracking-tight text-[#2D2D2D] leading-[1.1] mb-6 whitespace-pre-line">
                  {heroTitle}
                </h1>
                <p className="text-[15px] text-[#7A7A7A] leading-[1.7] mb-10 max-w-[400px] mx-auto lg:mx-0">
                  {heroSubtitle}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link to={heroLink} className="inline-flex items-center justify-center w-full sm:w-auto bg-[#BA9B74] text-white px-8 py-3.5 rounded-full font-medium text-[13px] tracking-widest hover:bg-[#A68A61] transition-all shadow-sm hover:shadow-md">
                    {heroCta.toUpperCase()}
                  </Link>
                  <Link to={heroLink} className="inline-flex items-center justify-center w-full sm:w-auto text-[#BA9B74] bg-white px-8 py-3.5 rounded-full border border-[#BA9B74] font-medium text-[13px] tracking-widest hover:bg-[#BA9B74]/10 transition-all">
                    VIEW DETAILS
                  </Link>
                </div>
              </div>
              <div className="relative h-full flex items-center justify-center mt-4 lg:mt-0 pb-8 lg:pb-0">
                <div className="relative w-64 h-64 sm:w-[320px] sm:h-[320px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] bg-[#E1D0BC] rounded-full overflow-hidden flex items-center justify-center z-10 shadow-xl">
                  <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Banner */}
      <section className="bg-[#F9F8F6] py-16 border-b border-gray-100">
        <div className="w-[90%] max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#BA9B74]/10">
              <div className="bg-[#F7F5F0] p-5 rounded-full text-[#BA9B74] mb-6 group-hover:scale-110 group-hover:-rotate-12 group-hover:bg-[#BA9B74] group-hover:text-white transition-all duration-500">
                <Truck className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h3 className="font-extrabold text-gray-900 tracking-widest uppercase text-sm mb-3">{settings?.feature_1_title || 'High-End Stitching'}</h3>
              <p className="text-[15px] text-gray-500 leading-relaxed max-w-xs">{settings?.feature_1_desc || 'Uncompromising attention to detail in every seam.'}</p>
            </div>
            
            <div className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#BA9B74]/10">
              <div className="bg-[#F7F5F0] p-5 rounded-full text-[#BA9B74] mb-6 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-[#BA9B74] group-hover:text-white transition-all duration-500">
                <ShieldCheck className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h3 className="font-extrabold text-gray-900 tracking-widest uppercase text-sm mb-3">{settings?.feature_2_title || 'Premium Fabrics'}</h3>
              <p className="text-[15px] text-gray-500 leading-relaxed max-w-xs">{settings?.feature_2_desc || 'Responsibly sourced, long-lasting wear for the modern wardrobe.'}</p>
            </div>
            
            <div className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#BA9B74]/10">
              <div className="bg-[#F7F5F0] p-5 rounded-full text-[#BA9B74] mb-6 group-hover:scale-110 group-hover:-rotate-12 group-hover:bg-[#BA9B74] group-hover:text-white transition-all duration-500">
                <Award className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h3 className="font-extrabold text-gray-900 tracking-widest uppercase text-sm mb-3">{settings?.feature_3_title || 'Global Export'}</h3>
              <p className="text-[15px] text-gray-500 leading-relaxed max-w-xs">{settings?.feature_3_desc || 'Delivering manufacturing excellence worldwide.'}</p>
            </div>

            <div className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#BA9B74]/10">
              <div className="bg-[#F7F5F0] p-5 rounded-full text-[#BA9B74] mb-6 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-[#BA9B74] group-hover:text-white transition-all duration-500">
                <Gem className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h3 className="font-extrabold text-gray-900 tracking-widest uppercase text-sm mb-3">Custom Tailoring</h3>
              <p className="text-[15px] text-gray-500 leading-relaxed max-w-xs">Bespoke manufacturing tailored perfectly to your requirements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sale Banner */}
      {saleBanner && (
        <section className="bg-ink relative overflow-hidden text-white py-16">
          {saleBanner.banner_image_url && (
            <div className="absolute inset-0 z-0">
              <img src={assetUrl(saleBanner.banner_image_url)} alt="Sale Banner" className="w-full h-full object-cover opacity-30" />
            </div>
          )}
          <div className="relative z-10 w-[90%] max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              {saleBanner.banner_title || saleBanner.name}
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              {saleBanner.banner_subtitle || `Save ${saleBanner.discount_type === 'percentage' ? `${saleBanner.discount_value}%` : `$${saleBanner.discount_value}`} on selected items!`}
            </p>
            <Link to="/products" className="inline-block bg-[#BA9B74] text-white font-bold px-8 py-4 rounded-full tracking-widest text-sm hover:bg-white hover:text-ink transition-colors shadow-lg">
              SHOP THE SALE
            </Link>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-24 bg-white">
        <div className="w-[90%] max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-accent font-semibold tracking-[0.2em] text-xs uppercase">Collections</span>
            <h2 className="text-3xl font-bold tracking-tight text-ink mt-2 mb-2">Shop by Category</h2>
            <p className="text-muted">Find your fit across our collections.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {categories.filter(c => !c.parent_id && c.show_on_home).map((c, idx) => {
              const catSale = getCategorySale(c.id);
              return (
              <Link key={c.id} to={`/products?category=${c.slug}`} className="group relative h-48 sm:h-80 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500 bg-gray-900">
                {catSale && (
                  <span className="absolute top-4 left-4 z-20 bg-[#BA9B74] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full shadow-md">
                    {catSale.discount_type === 'percentage' ? `${catSale.discount_value}% OFF` : `SALE`}
                  </span>
                )}
                <img
                  src={c.bg_image ? assetUrl(c.bg_image) : catImg[c.slug] || `https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1000&fit=crop`}
                  alt={c.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-end translate-y-2 sm:translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="w-8 sm:w-10 h-1 bg-accent rounded-full mb-2 sm:mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  <h3 className="text-xl sm:text-3xl font-extrabold text-white mb-2 sm:mb-3 drop-shadow-md">{c.name}</h3>
                  <div className="inline-flex items-center text-white font-medium text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full border border-white/30 flex items-center gap-1 sm:gap-2 shadow-lg">
                      Explore <span className="hidden sm:inline">Collection</span> <span className="text-accent font-bold group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            )})}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-24 bg-gray-50">
        <div className="w-[90%] max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-accent font-semibold tracking-[0.2em] text-xs uppercase">Curated</span>
              <h2 className="text-3xl font-bold tracking-tight text-ink mt-2 mb-2">Featured Pieces</h2>
              <p className="text-muted">Our most-loved styles this season.</p>
            </div>
            <Link to="/products" className="hidden sm:inline-flex items-center text-accent font-bold hover:text-accent-hover transition-colors">
              View All <span className="ml-2">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-6 gap-y-6 sm:gap-y-10">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-32 bg-ink text-center px-4">
        <div className="max-w-3xl mx-auto">
          <span className="text-accent font-semibold tracking-[0.2em] text-xs uppercase">Our Promise</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-3 mb-6">Quality You Can Feel</h2>
          <p className="text-lg text-gray-300 leading-relaxed font-light">
            We source responsibly, cut precisely, and finish carefully — so every custom dress we export meets a standard we're proud to put our name on.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center mt-9 bg-accent text-accent-foreground px-8 py-4 rounded-full font-semibold hover:bg-accent-hover transition-colors"
          >
            Explore the Collection <span className="ml-2">→</span>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="w-[90%] max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent font-semibold tracking-[0.2em] text-xs uppercase">Reviews</span>
            <h2 className="text-3xl font-bold tracking-tight text-ink mt-2 mb-2">What Our Customers Say</h2>
            <p className="text-muted">We place huge value on strong relationships and customer feedback.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 pb-12">
            {(testimonials.length > 0 ? testimonials : [
              {
                id: '1',
                subject: 'Amazing couture quality!',
                content: "I used to struggle finding reliable manufacturers for my boutique, but Velmoras Creation changed everything. The custom dresses are flawless, and international shipping is always on time.",
                name: 'MERI PIPENBAHER',
                role: 'Boutique Owner',
                image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop'
              },
              {
                id: '2',
                subject: 'Saves so much time',
                content: "Velmoras is a game-changer for our wholesale needs. Instead of endless back-and-forth, their bespoke tailoring process is seamless, meaning our custom collections launch perfectly every season!",
                name: 'SAM WISTER',
                role: 'Fashion Retailer',
                image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop'
              },
              {
                id: '3',
                subject: 'Highly recommended',
                content: "I have been ordering custom dresses from them for over a year now and I love the attention to detail! I can't imagine sourcing from anywhere else. The fabric quality is top-notch.",
                name: 'EMILA MARTINEZ',
                role: 'Brand Manager',
                image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
              }
            ]).map((t) => (
              <div key={t.id} className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 relative text-center mb-12 md:mb-0 flex flex-col h-full transition-all duration-300">
                <div className="text-accent mb-4 flex justify-center">
                  <svg className="w-12 h-12 fill-current opacity-20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>
                {t.subject && (
                  <h4 className="font-bold text-ink mb-2">{t.subject}</h4>
                )}
                <p className="text-gray-600 text-[15px] leading-relaxed mb-8 flex-grow">
                  "{t.content}"
                </p>
                
                <div className="mt-auto mb-4">
                  <h4 className="font-bold text-accent text-sm uppercase tracking-wider mb-1">{t.name}</h4>
                  <p className="text-slate-500 text-sm">{t.role}</p>
                </div>

                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                  {t.image_url ? (
                    <img 
                      src={assetUrl(t.image_url)} 
                      alt={t.name} 
                      className="w-20 h-20 rounded-full border-[6px] border-white object-cover shadow-sm bg-gray-100"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full border-[6px] border-white flex items-center justify-center text-gray-500 bg-gray-100 shadow-sm uppercase font-bold text-2xl">
                      {t.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry / Request a Quote */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[#F7F5F0]/50 z-0 skew-y-3 transform origin-bottom-left" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <span className="text-[#BA9B74] font-semibold tracking-[0.2em] text-xs uppercase">B2B & Custom Orders</span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mt-2 mb-4">Request a Quote</h2>
            <p className="text-gray-500">Interested in bulk orders, specific customizations, or high-volume exports? Reach out to us directly for tailored pricing.</p>
          </div>
          
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
            <form onSubmit={handleInquiry} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name / Company Name</label>
                  <input required type="text" value={inquiry.name} onChange={e => setInquiry({...inquiry, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#BA9B74] focus:border-transparent transition" placeholder="Your Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input required type="email" value={inquiry.email} onChange={e => setInquiry({...inquiry, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#BA9B74] focus:border-transparent transition" placeholder="you@company.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Details & Requirements</label>
                <textarea required rows="4" value={inquiry.message} onChange={e => setInquiry({...inquiry, message: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#BA9B74] focus:border-transparent transition resize-none" placeholder="Please specify fabrics, quantity, timelines, etc..." />
              </div>
              
              <div className="flex flex-col items-center">
                <button 
                  type="submit" 
                  disabled={inquiryStatus === 'sending'}
                  className="bg-[#BA9B74] text-white px-10 py-4 rounded-full font-bold tracking-widest text-sm hover:bg-[#A68A61] transition shadow-lg w-full md:w-auto disabled:opacity-70"
                >
                  {inquiryStatus === 'sending' ? 'SENDING INQUIRY...' : 'SUBMIT INQUIRY'}
                </button>
                {inquiryStatus === 'success' && <p className="text-green-600 mt-4 text-sm font-medium">Your inquiry has been received. We will get back to you shortly.</p>}
                {inquiryStatus === 'error' && <p className="text-red-500 mt-4 text-sm font-medium">There was an error sending your inquiry. Please try again.</p>}
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserHome;
