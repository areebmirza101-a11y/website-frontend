import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useSales } from '../context/SalesContext';
import { assetUrl } from '../api/client';

const SalePopup = () => {
  const { activeSales } = useSales();
  const [isOpen, setIsOpen] = useState(false);
  const [sale, setSale] = useState(null);

  useEffect(() => {
    if (activeSales && activeSales.length > 0) {
      // Find a sale to promote, prioritize one with a banner
      const activeSale = activeSales.find(s => s.banner_image_url || s.banner_title) || activeSales[0];
      
      if (activeSale) {
        // Check if we've already shown this specific sale popup in this session
        const popupKey = `sale_popup_shown_${activeSale.id}`;
        if (!sessionStorage.getItem(popupKey)) {
          setSale(activeSale);
          // Show popup after a short delay
          const timer = setTimeout(() => setIsOpen(true), 1500);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [activeSales]);

  const handleClose = () => {
    if (sale) {
      sessionStorage.setItem(`sale_popup_shown_${sale.id}`, 'true');
    }
    setIsOpen(false);
  };

  if (!isOpen || !sale) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-[2rem] shadow-2xl max-w-lg w-full overflow-hidden relative animate-in zoom-in-95 duration-500 delay-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white rounded-full text-ink hover:scale-110 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {sale.banner_image_url && (
          <div className="h-48 w-full relative">
            <img 
              src={assetUrl(sale.banner_image_url)} 
              alt={sale.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
          </div>
        )}

        <div className={`p-10 text-center ${!sale.banner_image_url ? 'pt-16' : 'pt-2'}`}>
          <span className="inline-block bg-accent/10 text-accent font-bold tracking-[0.2em] text-[10px] uppercase px-3 py-1.5 rounded-full mb-4">
            Special Offer
          </span>
          <h2 className="text-3xl font-black text-ink mb-3 leading-tight">
            {sale.banner_title || sale.name}
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            {sale.banner_subtitle || `Don't miss out! Get ${sale.discount_type === 'percentage' ? `${sale.discount_value}%` : `$${sale.discount_value}`} off on selected styles today.`}
          </p>
          <Link
            to="/products?on_sale=true"
            onClick={handleClose}
            className="inline-block w-full bg-accent text-white font-bold px-8 py-4 rounded-xl tracking-widest text-sm hover:bg-ink transition-colors shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-ink/20"
          >
            SHOP THE SALE
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SalePopup;
