import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useSales } from '../context/SalesContext';
import { money, categoryName, productImage } from '../lib/format';
import { assetUrl } from '../api/client';

const UserWishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { getProductSale } = useSales();

  const handleAddToCart = (product) => {
    const size = product.sizes?.[0] || null;
    const color = product.colors?.[0] || null;
    addToCart(product, { size, color, quantity: 1 });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="text-gray-400 hover:text-accent transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-ink uppercase tracking-tight flex items-center gap-3">
            <Heart className="w-8 h-8 text-accent fill-accent" />
            My Wishlist
          </h1>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-ink mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Save your favorite items here to review them later and easily add them to your cart when you're ready.
            </p>
            <Link to="/products" className="inline-flex items-center bg-ink text-white px-8 py-3.5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-accent transition-colors shadow-lg">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => {
              const saleInfo = getProductSale(product);
              const currentPrice = saleInfo ? saleInfo.salePrice : product.price;
              const soldOut = product.stock <= 0;
              const mainImg = (product.images || []).find((i) => i.is_main);
              const displayImage = mainImg ? assetUrl(mainImg.url) : productImage(product);
              const targetUrl = `/products/${product.slug || product.id}`;

              return (
                <div key={product.id} className="group flex flex-col h-full bg-white rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/20 border border-gray-200 shadow-sm relative">
                  
                  {/* Remove Button */}
                  <button 
                    onClick={(e) => { e.preventDefault(); removeFromWishlist(product.id); }}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-gray-100 hover:scale-110 hover:bg-red-50 hover:text-red-500 transition-all text-gray-400"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Top Image Section */}
                  <Link to={targetUrl} className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 block">
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="w-full h-full object-contain mix-blend-multiply transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                    />
                    
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
                  </Link>

                  {/* Bottom Text Section */}
                  <div className="p-5 flex flex-col flex-grow bg-white">
                    <div className="mb-2 flex justify-between items-start gap-4">
                      <Link to={targetUrl} className="hover:text-accent transition-colors flex-1">
                        <h3 className="text-base font-bold text-ink line-clamp-1 group-hover:text-accent transition-colors">{product.name}</h3>
                      </Link>
                      <div className="flex flex-col items-end">
                        {saleInfo ? (
                          <>
                            <p className="text-base font-extrabold text-[#BA9B74] whitespace-nowrap">{money(currentPrice)}</p>
                            <p className="text-[11px] font-bold text-gray-400 line-through whitespace-nowrap">{money(product.price)}</p>
                          </>
                        ) : (
                          <p className="text-base font-extrabold text-ink bg-gray-50 px-3 py-1 rounded-xl whitespace-nowrap">{money(currentPrice)}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">{categoryName(product)}</p>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={soldOut}
                      className="mt-auto w-full font-bold py-3.5 rounded-xl shadow-sm transition-all duration-300 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2 bg-ink text-white hover:bg-accent hover:shadow-accent/30"
                    >
                      {soldOut ? 'Sold out' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserWishlist;
