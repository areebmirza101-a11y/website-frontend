import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Award, Gem, ArrowRight, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productApi, categoryApi } from '../api';
import { apiFetch, assetUrl } from '../api/client';
import { useSales } from '../context/SalesContext';
import { useSettings } from '../context/SettingsContext';
import Seo from '../components/Seo';

const UserHome = () => {
  const { settings } = useSettings();
  const { activeSales, getCategorySale } = useSales();

  // 1. Initial State from Cache (eliminates frame-0 flash)
  const [featured, setFeatured] = useState(() => {
    try {
      const c = sessionStorage.getItem('velmoras_featured_prods');
      return c ? JSON.parse(c) : [];
    } catch (e) { return []; }
  });

  const [heroProducts, setHeroProducts] = useState(() => {
    try {
      const c = sessionStorage.getItem('velmoras_hero_prods');
      return c ? JSON.parse(c) : [];
    } catch (e) { return []; }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const c = sessionStorage.getItem('velmoras_home_cats');
      return c ? JSON.parse(c) : [];
    } catch (e) { return []; }
  });

  const [testimonials, setTestimonials] = useState(() => {
    try {
      const c = sessionStorage.getItem('velmoras_home_testimonials');
      return c ? JSON.parse(c) : [];
    } catch (e) { return []; }
  });

  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);

  const [loadingHero, setLoadingHero] = useState(() => {
    try { return !sessionStorage.getItem('velmoras_hero_prods'); } catch (e) { return true; }
  });
  const [loadingFeatured, setLoadingFeatured] = useState(() => {
    try { return !sessionStorage.getItem('velmoras_featured_prods'); } catch (e) { return true; }
  });
  const [loadingCategories, setLoadingCategories] = useState(() => {
    try { return !sessionStorage.getItem('velmoras_home_cats'); } catch (e) { return true; }
  });
  const [loadingTestimonials, setLoadingTestimonials] = useState(() => {
    try { return !sessionStorage.getItem('velmoras_home_testimonials'); } catch (e) { return true; }
  });

  // Form State for Inquiry
  const [inquiry, setInquiry] = useState({ name: '', email: '', message: '' });
  const [inquiryStatus, setInquiryStatus] = useState('');

  // Preload hero images into browser memory to eliminate image flicker
  useEffect(() => {
    if (heroProducts.length > 0) {
      heroProducts.forEach((p) => {
        const imgObj = p.images?.find((i) => i.is_main) || p.images?.[0];
        if (imgObj?.url) {
          const img = new Image();
          img.src = assetUrl(imgObj.url);
        }
      });
    }
  }, [heroProducts]);

  useEffect(() => {
    productApi.list({ featured: true, limit: 4 })
      .then((d) => {
        const prods = d.products || [];
        setFeatured(prods);
        try { sessionStorage.setItem('velmoras_featured_prods', JSON.stringify(prods)); } catch (e) {}
      })
      .catch(() => {})
      .finally(() => setLoadingFeatured(false));

    productApi.list({ show_in_hero: true, limit: 5 })
      .then((d) => {
        const prods = d.products || [];
        setHeroProducts(prods);
        try { sessionStorage.setItem('velmoras_hero_prods', JSON.stringify(prods)); } catch (e) {}
      })
      .catch(() => {})
      .finally(() => setLoadingHero(false));

    categoryApi.listWithSubs()
      .then((cats) => {
        setCategories(cats || []);
        try { sessionStorage.setItem('velmoras_home_cats', JSON.stringify(cats || [])); } catch (e) {}
      })
      .catch(() => {})
      .finally(() => setLoadingCategories(false));

    apiFetch('/testimonials')
      .then((tests) => {
        setTestimonials(tests || []);
        try { sessionStorage.setItem('velmoras_home_testimonials', JSON.stringify(tests || [])); } catch (e) {}
      })
      .catch(() => {})
      .finally(() => setLoadingTestimonials(false));
  }, []);

  useEffect(() => {
    if (heroProducts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % heroProducts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroProducts.length]);

  const heroTitle = settings?.hero_title || 'Screen-Accurate Cosplay &\nCinema Costumes.';
  const heroSubtitle = settings?.hero_subtitle || 'Handcrafted custom-made cosplay outfits, cinema replicas, armor, tunics & robes built to perfection. Worldwide express delivery.';
  const heroCta = settings?.cta_text || 'Explore Costumes';
  const heroLink = settings?.cta_link || '/products';
  const heroImage = settings?.hero_bg || '';

  // Find a global sale or any sale with a banner
  const saleBanner = activeSales.find((s) => s.banner_image_url || s.banner_title) || activeSales[0];

  const handleInquiry = async (e) => {
    e.preventDefault();
    setInquiryStatus('sending');
    try {
      await apiFetch('/contact', { method: 'POST', body: { ...inquiry, subject: 'B2B / Custom Costume Commission' } });
      setInquiryStatus('success');
      setInquiry({ name: '', email: '', message: '' });
      import('react-hot-toast').then(({ default: toast }) => toast.success('Inquiry sent successfully!'));
    } catch (err) {
      setInquiryStatus('error');
      import('react-hot-toast').then(({ default: toast }) => toast.error('Failed to send inquiry. Please try again.'));
    }
  };

  const currentHeroProduct = heroProducts[currentHeroIdx] || null;
  const currentHeroImgUrl = currentHeroProduct
    ? assetUrl(currentHeroProduct.images?.find((i) => i.is_main)?.url || currentHeroProduct.images?.[0]?.url)
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Seo
        title={settings?.company_name ? `${settings.company_name} — ${settings.tagline || 'Premium Leather Jackets, Cosplay & Superhero Outfits'}` : 'Velmoras Creation — Premium Leather Jackets & Cosplay'}
        description={settings?.hero_subtitle || 'Discover handcrafted genuine leather jackets, Star Wars & superhero cosplay costumes, cinema replicas, and bespoke collectible accessories with worldwide express shipping.'}
        keywords="Velmoras Creation, genuine leather jackets, star wars merchandise, star wars accessories, darth vader jacket, mandalorian costume, superhero merchandise, batman leather jacket, wolverine leather jacket, handmade leather products, custom leather jackets, leather biker jackets, bespoke costumes, buy leather jackets online, shop superhero merchandise online"
        url="https://www.velmorascreation.com/"
      />

      {/* Hero Section */}
      <section className="relative min-h-screen lg:min-h-[600px] lg:h-[85vh] flex items-center overflow-hidden bg-white pt-24 pb-12 lg:py-0">
        <div className="relative w-[90%] max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-full z-10">
          {loadingHero ? (
            /* Elegant Skeleton Loader - Prevents layout shift & flashes */
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full items-center gap-12 lg:gap-8 animate-pulse">
              <div className="max-w-xl z-10 pl-0 lg:pl-10 text-center lg:text-left mx-auto lg:mx-0 mt-8 lg:mt-0 space-y-6">
                <div className="h-6 w-32 bg-[#EBE7DF] rounded-md mx-auto lg:mx-0" />
                <div className="h-20 w-full max-w-md bg-gray-200 rounded-2xl mx-auto lg:mx-0" />
                <div className="h-14 w-full max-w-sm bg-gray-100 rounded-xl mx-auto lg:mx-0" />
                <div className="flex justify-center lg:justify-start gap-4 pt-2">
                  <div className="h-12 w-44 bg-[#BA9B74]/30 rounded-full" />
                  <div className="h-12 w-36 bg-gray-200 rounded-full" />
                </div>
              </div>
              <div className="relative h-full flex items-center justify-center mt-4 lg:mt-0 pb-8 lg:pb-0">
                <div className="w-64 h-64 sm:w-[320px] sm:h-[320px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] bg-[#E1D0BC]/40 rounded-full" />
              </div>
            </div>
          ) : heroProducts.length > 0 && currentHeroProduct ? (
            /* Dynamic Hero Product Slider */
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full items-center gap-12 lg:gap-8">
              {/* Text Column */}
              <div className="max-w-xl z-10 pl-0 lg:pl-10 text-center lg:text-left mx-auto lg:mx-0 mt-8 lg:mt-0">
                <span className="inline-block bg-[#EBE7DF] text-[#A68A61] font-bold tracking-[0.05em] text-[11px] uppercase px-3 py-1.5 mb-6">
                  NEW ARRIVAL...
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-[4.5rem] font-bold tracking-tight text-[#2D2D2D] leading-[1.1] mb-6 whitespace-pre-line">
                  {heroTitle}
                </h1>
                <p className="text-[15px] text-[#7A7A7A] leading-[1.7] mb-10 max-w-[420px] mx-auto lg:mx-0">
                  {heroSubtitle}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    to={`/products/${currentHeroProduct.slug}`}
                    className="inline-flex items-center justify-center w-full sm:w-auto bg-[#BA9B74] text-white px-8 py-3.5 rounded-full font-medium text-[13px] tracking-widest hover:bg-[#A68A61] transition-all shadow-sm hover:shadow-md"
                  >
                    {heroCta.toUpperCase()}
                  </Link>
                  <Link
                    to={`/products/${currentHeroProduct.slug}`}
                    className="inline-flex items-center justify-center w-full sm:w-auto text-[#BA9B74] bg-white px-8 py-3.5 rounded-full border border-[#BA9B74] font-medium text-[13px] tracking-widest hover:bg-[#BA9B74]/10 transition-all"
                  >
                    VIEW DETAILS
                  </Link>
                </div>
              </div>

              {/* Product Column */}
              <div className="relative h-full flex items-center justify-center mt-4 lg:mt-0 pb-8 lg:pb-0">
                <div className="relative w-64 h-64 sm:w-[320px] sm:h-[320px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] bg-[#E1D0BC] rounded-full overflow-hidden flex items-center justify-center z-10 shadow-xl">
                  {currentHeroImgUrl ? (
                    <img
                      key={currentHeroProduct.id}
                      src={currentHeroImgUrl}
                      alt={currentHeroProduct.name}
                      decoding="async"
                      className="w-full h-full object-contain mix-blend-multiply p-6 sm:p-8 transition-transform duration-700 ease-out hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#BA9B74] font-bold text-lg">
                      Velmoras Creation
                    </div>
                  )}
                </div>

                {/* Slider Dots */}
                {heroProducts.length > 1 && (
                  <div className="absolute bottom-[-20px] lg:bottom-auto lg:right-[-10px] lg:top-1/2 lg:transform lg:-translate-y-1/2 flex flex-row lg:flex-col gap-2.5 z-30 justify-center w-full lg:w-auto">
                    {heroProducts.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentHeroIdx(idx)}
                        aria-label={`Slide ${idx + 1}`}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          idx === currentHeroIdx ? 'bg-[#997F64] scale-125' : 'bg-[#D1C6BA] hover:bg-[#A68A61]'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Branded Costume Fallback Hero (if no hero products configured) */
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full items-center gap-12 lg:gap-8">
              <div className="max-w-xl z-10 pl-0 lg:pl-10 text-center lg:text-left mx-auto lg:mx-0 mt-8 lg:mt-0">
                <span className="inline-block bg-[#EBE7DF] text-[#A68A61] font-bold tracking-[0.05em] text-[11px] uppercase px-3 py-1.5 mb-6">
                  BESPOKE TAILORING
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-[4.5rem] font-bold tracking-tight text-[#2D2D2D] leading-[1.1] mb-6 whitespace-pre-line">
                  {heroTitle}
                </h1>
                <p className="text-[15px] text-[#7A7A7A] leading-[1.7] mb-10 max-w-[420px] mx-auto lg:mx-0">
                  {heroSubtitle}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    to={heroLink}
                    className="inline-flex items-center justify-center w-full sm:w-auto bg-[#BA9B74] text-white px-8 py-3.5 rounded-full font-medium text-[13px] tracking-widest hover:bg-[#A68A61] transition-all shadow-sm hover:shadow-md"
                  >
                    {heroCta.toUpperCase()}
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center w-full sm:w-auto text-[#BA9B74] bg-white px-8 py-3.5 rounded-full border border-[#BA9B74] font-medium text-[13px] tracking-widest hover:bg-[#BA9B74]/10 transition-all"
                  >
                    CUSTOM COMMISSIONS
                  </Link>
                </div>
              </div>
              <div className="relative h-full flex items-center justify-center mt-4 lg:mt-0 pb-8 lg:pb-0">
                <div className="relative w-64 h-64 sm:w-[320px] sm:h-[320px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] bg-gradient-to-br from-[#E1D0BC] to-[#D1C6BA] rounded-full overflow-hidden flex items-center justify-center z-10 shadow-xl">
                  {heroImage ? (
                    <img src={assetUrl(heroImage)} alt="Velmoras Creation Hero" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-8 text-ink">
                      <Gem className="w-16 h-16 mx-auto mb-3 text-[#BA9B74]" />
                      <p className="font-extrabold uppercase tracking-widest text-sm">Velmoras Creation</p>
                      <p className="text-xs text-gray-600 mt-1">Cinema Costumes & Cosplay</p>
                    </div>
                  )}
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
              <h3 className="font-extrabold text-gray-900 tracking-widest uppercase text-sm mb-3">
                {settings?.feature_1_title || 'Master Craftsmanship'}
              </h3>
              <p className="text-[15px] text-gray-500 leading-relaxed max-w-xs">
                {settings?.feature_1_desc || 'Uncompromising attention to detail in every seam, armor piece & stitch.'}
              </p>
            </div>

            <div className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#BA9B74]/10">
              <div className="bg-[#F7F5F0] p-5 rounded-full text-[#BA9B74] mb-6 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-[#BA9B74] group-hover:text-white transition-all duration-500">
                <ShieldCheck className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h3 className="font-extrabold text-gray-900 tracking-widest uppercase text-sm mb-3">
                {settings?.feature_2_title || 'Screen-Accurate Fabrics'}
              </h3>
              <p className="text-[15px] text-gray-500 leading-relaxed max-w-xs">
                {settings?.feature_2_desc || 'Cinema-grade textiles, heavy-duty linens & genuine leathers built to last.'}
              </p>
            </div>

            <div className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#BA9B74]/10">
              <div className="bg-[#F7F5F0] p-5 rounded-full text-[#BA9B74] mb-6 group-hover:scale-110 group-hover:-rotate-12 group-hover:bg-[#BA9B74] group-hover:text-white transition-all duration-500">
                <Award className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h3 className="font-extrabold text-gray-900 tracking-widest uppercase text-sm mb-3">
                {settings?.feature_3_title || 'Worldwide Express Export'}
              </h3>
              <p className="text-[15px] text-gray-500 leading-relaxed max-w-xs">
                {settings?.feature_3_desc || 'Secure international shipping with live tracking to your doorstep.'}
              </p>
            </div>

            <div className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#BA9B74]/10">
              <div className="bg-[#F7F5F0] p-5 rounded-full text-[#BA9B74] mb-6 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-[#BA9B74] group-hover:text-white transition-all duration-500">
                <Gem className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h3 className="font-extrabold text-gray-900 tracking-widest uppercase text-sm mb-3">
                {settings?.feature_4_title || 'Bespoke Custom Fit'}
              </h3>
              <p className="text-[15px] text-gray-500 leading-relaxed max-w-xs">
                {settings?.feature_4_desc || 'Tailored specifically to your unique body measurements for a cinematic look.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sale Banner */}
      {saleBanner && (
        <section className="bg-ink relative overflow-hidden text-white py-16">
          {saleBanner.banner_image_url && (
            <div className="absolute inset-0 z-0">
              <img
                src={assetUrl(saleBanner.banner_image_url)}
                alt="Sale Banner"
                className="w-full h-full object-cover opacity-30"
              />
            </div>
          )}
          <div className="relative z-10 w-[90%] max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              {saleBanner.banner_title || saleBanner.name}
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              {saleBanner.banner_subtitle ||
                `Save ${
                  saleBanner.discount_type === 'percentage'
                    ? `${saleBanner.discount_value}%`
                    : `$${saleBanner.discount_value}`
                } on selected costumes!`}
            </p>
            <Link
              to="/products"
              className="inline-block bg-[#BA9B74] text-white font-bold px-8 py-4 rounded-full tracking-widest text-sm hover:bg-white hover:text-ink transition-colors shadow-lg"
            >
              SHOP THE SALE
            </Link>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="w-[90%] max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-accent font-semibold tracking-[0.2em] text-xs uppercase">Collections</span>
            <h2 className="text-3xl font-bold tracking-tight text-ink mt-2 mb-2">Shop by Category</h2>
            <p className="text-muted">Explore screen-accurate costumes, Jedi tunics, Sith robes & Beskar sets.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {loadingCategories ? (
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 sm:h-80 rounded-[1.5rem] sm:rounded-[2rem] bg-gray-100 animate-pulse border border-gray-100 shadow-xs relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-200/70 to-transparent" />
                  <div className="absolute bottom-6 left-6 space-y-2">
                    <div className="h-2 w-12 bg-gray-200 rounded-full" />
                    <div className="h-6 w-28 bg-gray-300 rounded-md" />
                  </div>
                </div>
              ))
            ) : (
              categories
                .filter((c) => !c.parent_id && c.show_on_home)
                .map((c) => {
                  const catSale = getCategorySale(c.id);
                  return (
                    <Link
                      key={c.id}
                      to={`/products?category=${c.slug}`}
                      className="group relative h-48 sm:h-80 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500 bg-gray-900"
                    >
                      {catSale && (
                        <span className="absolute top-4 left-4 z-20 bg-[#BA9B74] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full shadow-md">
                          {catSale.discount_type === 'percentage' ? `${catSale.discount_value}% OFF` : `SALE`}
                        </span>
                      )}
                      <img
                        src={
                          c.bg_image
                            ? assetUrl(c.bg_image)
                            : 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&h=1000&fit=crop'
                        }
                        alt={c.name}
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                      <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-end translate-y-2 sm:translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="w-8 sm:w-10 h-1 bg-accent rounded-full mb-2 sm:mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        <h3 className="text-xl sm:text-3xl font-extrabold text-white mb-2 sm:mb-3 drop-shadow-md">
                          {c.name}
                        </h3>
                        <div className="inline-flex items-center text-white font-medium text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                          <span className="bg-white/20 backdrop-blur-md px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full border border-white/30 flex items-center gap-1 sm:gap-2 shadow-lg">
                            Explore <span className="hidden sm:inline">Collection</span>{' '}
                            <ArrowRight className="h-3.5 w-3.5 text-accent font-bold group-hover:translate-x-1 transition-transform inline-block" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })
            )}
          </div>
        </div>
      </section>

      {/* Featured Pieces */}
      <section className="py-24 bg-gray-50">
        <div className="w-[90%] max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-accent font-semibold tracking-[0.2em] text-xs uppercase">Curated</span>
              <h2 className="text-3xl font-bold tracking-tight text-ink mt-2 mb-2">Featured Outfits</h2>
              <p className="text-muted">Our most-requested cinema replicas and master suits.</p>
            </div>
            <Link
              to="/products"
              className="group hidden sm:inline-flex items-center gap-1.5 text-accent font-bold hover:text-accent-hover transition-colors"
            >
              View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-6 gap-y-6 sm:gap-y-10">
            {loadingFeatured ? (
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col h-full bg-white rounded-[2rem] border border-gray-100 shadow-xs p-2 animate-pulse"
                >
                  <div className="aspect-[4/5] rounded-[1.5rem] bg-gray-100" />
                  <div className="p-4 space-y-3 mt-auto">
                    <div className="h-4 w-3/4 bg-gray-100 rounded-md" />
                    <div className="h-4 w-1/3 bg-gray-200 rounded-md" />
                  </div>
                </div>
              ))
            ) : (
              featured.map((product) => <ProductCard key={product.id} product={product} />)
            )}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-32 bg-ink text-center px-4">
        <div className="max-w-3xl mx-auto">
          <span className="text-accent font-semibold tracking-[0.2em] text-xs uppercase">Our Promise</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-3 mb-6">Screen Accuracy You Can Trust</h2>
          <p className="text-lg text-gray-300 leading-relaxed font-light">
            Every stitch, pleat, armor contour and lining is crafted by dedicated artisans. Whether preparing for a major comic convention, cosplay championship, or film production, Velmoras delivers master-grade execution.
          </p>
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 mt-9 bg-accent text-accent-foreground px-8 py-4 rounded-full font-semibold hover:bg-accent-hover transition-colors"
          >
            Explore All Costumes <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="w-[90%] max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent font-semibold tracking-[0.2em] text-xs uppercase">Reviews</span>
            <h2 className="text-3xl font-bold tracking-tight text-ink mt-2 mb-2">What Our Clients Say</h2>
            <p className="text-muted">Real feedback from cosplayers, collectors, and film productions worldwide.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 pb-12">
            {loadingTestimonials ? (
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 animate-pulse flex flex-col h-72"
                >
                  <div className="h-4 w-12 bg-gray-200 rounded mx-auto mb-6" />
                  <div className="h-5 w-3/4 bg-gray-200 rounded mx-auto mb-4" />
                  <div className="space-y-2 flex-grow">
                    <div className="h-3 w-full bg-gray-100 rounded" />
                    <div className="h-3 w-5/6 bg-gray-100 rounded mx-auto" />
                  </div>
                  <div className="h-4 w-28 bg-gray-200 rounded mx-auto mt-auto" />
                </div>
              ))
            ) : (
              (testimonials.length > 0 ? testimonials : [
                {
                  id: 'def-1',
                  subject: 'Incredible Screen Accuracy!',
                  content: 'Ordered the Kylo Ren tunic and cape set. The fabric texture, weight, and pleated detailing are completely movie-grade. Received countless compliments at London Comic Con!',
                  name: 'David Sterling',
                  role: '501st Legion Member / UK',
                  image_url: ''
                },
                {
                  id: 'def-2',
                  subject: 'Flawless Bespoke Fit',
                  content: 'Provided custom body measurements for the Obi-Wan Kenobi Jedi Knight set. Every piece fit like a glove straight out of the package. Express delivery was fast and secure.',
                  name: 'Marcus Vance',
                  role: 'Cosplay Competitor / USA',
                  image_url: ''
                },
                {
                  id: 'def-3',
                  subject: 'Unmatched Master Tailoring',
                  content: 'Velmoras Creation has become our primary supplier for custom cinema outfits. Their attention to detail, genuine leather craftsmanship, and stitch durability are extraordinary.',
                  name: 'Sarah Lindqvist',
                  role: 'Theater Costume Designer / Sweden',
                  image_url: ''
                }
              ]).map((t) => (
                <div
                  key={t.id}
                  className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 relative text-center mb-12 md:mb-0 flex flex-col h-full transition-all duration-300"
                >
                  <div className="text-accent mb-4 flex justify-center">
                    <svg className="w-10 h-10 fill-current opacity-20" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  {t.subject && <h4 className="font-bold text-ink mb-2">{t.subject}</h4>}
                  <p className="text-gray-600 text-[15px] leading-relaxed mb-8 flex-grow">
                    "{t.content}"
                  </p>

                  <div className="mt-auto mb-4">
                    <h4 className="font-bold text-accent text-sm uppercase tracking-wider mb-1">{t.name}</h4>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>

                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                    {t.image_url ? (
                      <img
                        src={assetUrl(t.image_url)}
                        alt={t.name}
                        decoding="async"
                        className="w-20 h-20 rounded-full border-[6px] border-white object-cover shadow-sm bg-gray-100"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full border-[6px] border-white flex items-center justify-center text-[#BA9B74] bg-[#F7F5F0] shadow-sm uppercase font-bold text-xl">
                        {t.name ? t.name.charAt(0) : 'V'}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Inquiry / Request a Quote */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[#F7F5F0]/50 z-0 skew-y-3 transform origin-bottom-left" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <span className="text-[#BA9B74] font-semibold tracking-[0.2em] text-xs uppercase">
              B2B & Custom Commissions
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mt-2 mb-4">Request a Quote</h2>
            <p className="text-gray-500">
              Looking for bespoke movie armor, custom convention cosplay, or bulk studio orders? Contact us directly for tailored specs and turnaround times.
            </p>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
            <form onSubmit={handleInquiry} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name / Production Name</label>
                  <input
                    required
                    type="text"
                    value={inquiry.name}
                    onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#BA9B74] focus:border-transparent transition"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    required
                    type="email"
                    value={inquiry.email}
                    onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#BA9B74] focus:border-transparent transition"
                    placeholder="you@domain.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cosplay / Character Details & Measurements</label>
                <textarea
                  required
                  rows="4"
                  value={inquiry.message}
                  onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#BA9B74] focus:border-transparent transition resize-none"
                  placeholder="Specify character name, references, required fabrics, timeline deadline, and any custom sizing..."
                />
              </div>

              <div className="flex flex-col items-center">
                <button
                  type="submit"
                  disabled={inquiryStatus === 'sending'}
                  className="bg-[#BA9B74] text-white px-10 py-4 rounded-full font-bold tracking-widest text-sm hover:bg-[#A68A61] transition shadow-lg w-full md:w-auto disabled:opacity-70"
                >
                  {inquiryStatus === 'sending' ? 'SENDING INQUIRY...' : 'SUBMIT INQUIRY'}
                </button>
                {inquiryStatus === 'success' && (
                  <p className="text-green-600 mt-4 text-sm font-medium">
                    Your inquiry has been received. Our tailoring master will review and reply promptly!
                  </p>
                )}
                {inquiryStatus === 'error' && (
                  <p className="text-red-500 mt-4 text-sm font-medium">
                    There was an error sending your inquiry. Please try again or WhatsApp us directly.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserHome;
