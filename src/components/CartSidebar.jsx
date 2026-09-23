import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { money } from '../lib/format';

const CartSidebar = () => {
  const { isCartOpen, toggleCart, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    toggleCart();
    navigate('/checkout');
  };

  return (
    <>
      <div className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-50 transition-opacity" onClick={toggleCart} />

      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white/95 backdrop-blur-3xl shadow-2xl z-50 flex flex-col border-l border-white/40">
        <div className="flex items-center justify-between p-8 border-b border-gray-200/60">
          <h2 className="text-xl font-black text-ink uppercase tracking-widest">Your Cart</h2>
          <button onClick={toggleCart} className="p-2 text-gray-400 hover:text-ink hover:bg-gray-100 rounded-full transition-all duration-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-5">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2 shadow-inner">
                <span className="text-3xl">🛍️</span>
              </div>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Your cart is empty.</p>
              <button
                onClick={() => { toggleCart(); navigate('/products'); }}
                className="mt-4 bg-ink text-white font-bold py-3 px-8 rounded-xl hover:bg-accent hover:shadow-lg transition-all active:scale-95 text-xs tracking-widest uppercase"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.key} className="flex gap-5 group">
                <div className="w-24 h-32 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-gray-200/60 p-2">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-black text-ink line-clamp-2">{item.name}</h3>
                      <button onClick={() => removeFromCart(item.key)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {(item.size || item.color) && (
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1.5">
                        {[item.size, item.color].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p className="text-sm font-bold text-ink mt-2">{money(item.price)}</p>
                  </div>
                  <div className="flex items-center bg-gray-100 rounded-xl w-fit mt-3 border border-gray-200 shadow-sm">
                    <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="p-2 text-gray-500 hover:text-ink transition-colors">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-ink">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="p-2 text-gray-500 hover:text-ink transition-colors">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-8 border-t border-gray-200/60 bg-white/50 backdrop-blur-md">
            <div className="flex justify-between items-end mb-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subtotal</p>
              <p className="text-xl font-black text-ink">{money(cartTotal)}</p>
            </div>
            <p className="text-[11px] text-gray-500 mb-6 font-medium italic">Shipping & taxes calculated at checkout.</p>
            <button
              onClick={handleCheckout}
              className="w-full bg-ink text-white font-black tracking-widest uppercase text-sm py-5 rounded-2xl shadow-xl hover:bg-accent hover:shadow-accent/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Checkout <span className="text-lg leading-none">→</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
