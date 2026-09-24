import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSales } from '../context/SalesContext';
import { money, productImage, categoryName } from '../lib/format';
import { assetUrl } from '../api/client';

const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { getProductSale } = useSales();

  const quickAdd = (e) => {
    e.preventDefault();
    const size = product.sizes?.[0] || null;
    const color = product.colors?.[0] || null;
    addToCart(product, { size, color, quantity: 1 });
  };

  const soldOut = product.stock <= 0;
  const inCart = cartItems.some(i => i.id === product.id);
  const mainImg = (product.images || []).find((i) => i.is_main);
  const displayImage = mainImg ? assetUrl(mainImg.url) : productImage(product);
  const targetUrl = `/products/${product.slug || product.id}`;
  
  const saleInfo = getProductSale(product);
  const currentPrice = saleInfo ? saleInfo.salePrice : product.price;

  return (
    <div className="group flex flex-col h-full bg-white rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:shadow-accent/20 border border-gray-200 shadow-sm p-2 relative">
      {/* Top Image Section */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 block rounded-[1.5rem]">
        <Link to={targetUrl} className="block w-full h-full">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
          />
        </Link>
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-gray-100 hover:scale-110 transition-transform"
        >
          <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
        
        {/* Subtle dark gradient on hover for better button contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {saleInfo && !soldOut && (
          <span className="absolute top-4 left-4 bg-[#BA9B74] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full shadow-md z-10">
            {saleInfo.discount_type === 'percentage' ? `${saleInfo.discount_value}% OFF` : `SALE`}
          </span>
        )}

        {soldOut && (
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-ink text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full shadow-sm border border-gray-100 z-10">
            Sold out
          </span>
        )}
        
        {/* Floating Quick Add Button over Image */}
        {!soldOut && (
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-8 group-hover:translate-y-0 hidden md:flex justify-center">
            <button
              onClick={quickAdd}
              className={`w-[90%] backdrop-blur-xl border font-bold py-3.5 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-2 ${
                inCart
                  ? 'bg-green-500/90 border-green-400/60 text-white'
                  : 'bg-white/90 border-white/60 text-ink hover:bg-accent hover:text-white hover:border-accent'
              }`}
            >
              {inCart ? (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Added to Cart
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Quick Add
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Bottom Text Section */}
      <div className="p-3 sm:p-5 flex flex-col flex-grow bg-white">
        <div className="mb-2 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
          <Link to={targetUrl} className="hover:text-accent transition-colors flex-1">
            <h3 className="text-sm sm:text-base font-bold text-ink line-clamp-1 group-hover:text-accent transition-colors">{product.name}</h3>
          </Link>
          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
            {saleInfo ? (
              <>
                <p className="text-sm sm:text-base font-extrabold text-[#BA9B74] whitespace-nowrap">{money(currentPrice)}</p>
                <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 line-through whitespace-nowrap">{money(product.price)}</p>
              </>
            ) : (
              <p className="text-sm sm:text-base font-extrabold text-ink bg-gray-50 px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl whitespace-nowrap">{money(currentPrice)}</p>
            )}
          </div>
        </div>
        <p className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 sm:mb-4">{categoryName(product)}</p>

        {/* Mobile Add to Cart Button */}
        <button
          onClick={quickAdd}
          disabled={soldOut}
          className={`mt-auto w-full md:hidden font-bold py-3.5 rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2 ${
            inCart
              ? 'bg-green-500 text-white'
              : 'bg-ink text-white hover:bg-accent hover:shadow-accent/30'
          }`}
        >
          {soldOut ? 'Sold out' : inCart ? 'Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
