import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { productImage } from '../lib/format';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const STORAGE_KEY = 'ecom_cart';
const lineKey = (id, size, color) => `${id}::${size || ''}::${color || ''}`;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // product: API product; opts: { size, color, quantity }
  const addToCart = (product, opts = {}) => {
    const { size = null, color = null, quantity = 1 } = opts;
    const key = lineKey(product.id, size, color);
    const item = {
      key,
      id: product.id,
      name: product.name,
      price: parseFloat(product.price) || 0,
      image: productImage(product),
      size,
      color,
    };

    setCartItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        toast.success(`Updated quantity for ${product.name}`);
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
      }
      toast.success(`${product.name} added to cart!`);
      return [...prev, { ...item, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (key) => {
    setCartItems((prev) => prev.filter((i) => i.key !== key));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (key, quantity) => {
    if (quantity < 1) return removeFromCart(key);
    setCartItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity } : i)));
  };

  const clearCart = () => setCartItems([]);
  const toggleCart = () => setIsCartOpen((o) => !o);

  const cartTotal = cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
  const cartCount = cartItems.reduce((c, i) => c + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        toggleCart,
        setIsCartOpen,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
