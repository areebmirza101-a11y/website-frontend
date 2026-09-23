import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle } from 'lucide-react';

const CheckoutSuccess = () => {
  const { clearCart } = useCart();
  const [params] = useSearchParams();
  const orderId = params.get('order');

  // Payment completed → empty the cart
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 px-4">
      <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
      <h1 className="text-4xl font-bold text-ink mb-4 text-center">Order Confirmed</h1>
      <p className="text-muted text-lg mb-2 text-center max-w-md">
        Thank you for your purchase! A confirmation has been sent to your email.
      </p>
      {orderId && <p className="text-gray-400 text-sm mb-8">Order reference: #{orderId}</p>}
      <Link to="/products" className="bg-accent text-accent-foreground px-8 py-4 rounded-xl font-medium hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20">
        Continue Shopping
      </Link>
    </div>
  );
};

export default CheckoutSuccess;
