import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api';
import { money } from '../lib/format';
import { CreditCard, Truck, AlertCircle } from 'lucide-react';

const UserCheckout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    country: '',
    zip: '',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('paypal'); // 'paypal' or 'manual'
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const createdOrderIdRef = useRef(null);

  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Manual / COD order submission
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        customer: form,
        items: cartItems.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
        })),
        currency: 'USD',
      };
      const result = await orderApi.checkout(payload);
      clearCart();
      navigate(`/checkout/success?order=${result.orderId}`);
    } catch (err) {
      setError(err.message || 'Checkout failed. Please try again.');
      setSubmitting(false);
    }
  };

  const validateForm = () => {
    if (!form.name.trim() || !form.email.trim() || !form.address.trim()) {
      setError('Please fill in your name, email, and shipping address first.');
      return false;
    }
    return true;
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <p className="text-xl text-muted mb-4">Your cart is empty.</p>
        <Link to="/products" className="text-accent font-medium underline hover:text-accent-hover transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const input =
    'w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-accent focus:border-accent outline-none transition-colors';

  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-32 relative z-10">
      <div className="w-[90%] max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black tracking-widest text-ink mb-12 uppercase text-center lg:text-left">
          Checkout
        </h1>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Form */}
          <div className="w-full lg:w-2/3">
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-200/60 shadow-sm">
                <h2 className="text-sm font-black text-ink mb-8 tracking-[0.2em] uppercase">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
                      Full name *
                    </label>
                    <input required value={form.name} onChange={set('name')} className={input} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={set('email')}
                      className={input}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
                      Phone <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input value={form.phone} onChange={set('phone')} className={input} placeholder="+1 234 567 890" />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-200/60 shadow-sm">
                <h2 className="text-sm font-black text-ink mb-8 tracking-[0.2em] uppercase">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
                      Address *
                    </label>
                    <input
                      required
                      value={form.address}
                      onChange={set('address')}
                      className={input}
                      placeholder="Street address, apartment, suite, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
                      City
                    </label>
                    <input value={form.city} onChange={set('city')} className={input} placeholder="New York" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
                      Country
                    </label>
                    <input value={form.country} onChange={set('country')} className={input} placeholder="United States" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
                      Postal code
                    </label>
                    <input value={form.zip} onChange={set('zip')} className={input} placeholder="10001" />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-200/60 shadow-sm">
                <h2 className="text-sm font-black text-ink mb-6 tracking-[0.2em] uppercase">Select Payment Method</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* PayPal Option */}
                  <label
                    onClick={() => setPaymentMethod('paypal')}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition-all flex items-start gap-4 ${
                      paymentMethod === 'paypal'
                        ? 'border-accent bg-accent/5 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="w-5 h-5 text-accent" />
                        <span className="font-bold text-ink text-sm">PayPal / Cards</span>
                      </div>
                      <p className="text-xs text-gray-500">Pay securely with PayPal balance or International Debit/Credit Card</p>
                    </div>
                  </label>

                  {/* Manual / COD Option */}
                  <label
                    onClick={() => setPaymentMethod('manual')}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition-all flex items-start gap-4 ${
                      paymentMethod === 'manual'
                        ? 'border-accent bg-accent/5 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="manual"
                      checked={paymentMethod === 'manual'}
                      onChange={() => setPaymentMethod('manual')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Truck className="w-5 h-5 text-accent" />
                        <span className="font-bold text-ink text-sm">Manual / Offline</span>
                      </div>
                      <p className="text-xs text-gray-500">Cash on delivery or manual wire transfer arrangement</p>
                    </div>
                  </label>
                </div>

                {/* PayPal Checkout Section */}
                {paymentMethod === 'paypal' && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest font-bold">
                      Pay with PayPal or Debit/Credit Card:
                    </p>
                    {paypalClientId ? (
                      <PayPalScriptProvider
                        options={{
                          clientId: paypalClientId,
                          currency: 'USD',
                          intent: 'capture',
                        }}
                      >
                        <PayPalButtons
                          style={{
                            layout: 'vertical',
                            shape: 'rect',
                            color: 'gold',
                            label: 'pay',
                          }}
                          onClick={(data, actions) => {
                            if (!validateForm()) {
                              return actions.reject();
                            }
                            return actions.resolve();
                          }}
                          createOrder={async () => {
                            setError(null);
                            try {
                              const payload = {
                                customer: form,
                                items: cartItems.map((i) => ({
                                  productId: i.id,
                                  quantity: i.quantity,
                                  size: i.size,
                                  color: i.color,
                                })),
                                currency: 'USD',
                              };
                              const result = await orderApi.createPaypalOrder(payload);
                              createdOrderIdRef.current = result.orderId;
                              return result.paypalOrderId;
                            } catch (err) {
                              setError(err.message || 'Failed to initialize PayPal order.');
                              throw err;
                            }
                          }}
                          onApprove={async (data) => {
                            setSubmitting(true);
                            try {
                              await orderApi.capturePaypalOrder({
                                paypalOrderId: data.orderID,
                                orderId: createdOrderIdRef.current,
                              });
                              clearCart();
                              navigate(`/checkout/success?order=${createdOrderIdRef.current}`);
                            } catch (err) {
                              setError(err.message || 'Payment capture failed. Please contact support.');
                              setSubmitting(false);
                            }
                          }}
                          onError={(err) => {
                            console.error('PayPal error:', err);
                            setError('PayPal payment failed or was interrupted. Please try again.');
                            setSubmitting(false);
                          }}
                          onCancel={() => {
                            setSubmitting(false);
                          }}
                        />
                      </PayPalScriptProvider>
                    ) : (
                      <div className="p-4 rounded-xl bg-amber-50 text-amber-800 text-sm">
                        PayPal Client ID is not configured. Please add `VITE_PAYPAL_CLIENT_ID` in your `.env`.
                      </div>
                    )}
                  </div>
                )}

                {/* Manual Complete Order Button */}
                {paymentMethod === 'manual' && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="bg-gray-50 p-6 rounded-2xl mb-6 flex items-start gap-4">
                      <div className="text-accent mt-0.5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed font-bold uppercase tracking-widest">
                        Payment details will be arranged after you place the order. Our team will contact you to confirm
                        payment and shipping.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-ink text-white py-5 rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-accent hover:shadow-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-60 flex justify-between px-8 items-center"
                    >
                      <span>{submitting ? 'Processing...' : 'Complete Order'}</span>
                      <span>{money(cartTotal)}</span>
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200/60 shadow-sm sticky top-28">
              <h2 className="text-sm font-black text-ink mb-8 tracking-[0.2em] uppercase">Order Summary</h2>
              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.key} className="flex gap-4 group">
                    <div className="w-20 h-24 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-gray-200/60 p-1.5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 py-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-black text-ink line-clamp-1">{item.name}</h3>
                        {(item.size || item.color) && (
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                            {[item.size, item.color].filter(Boolean).join(' · ')}
                          </p>
                        )}
                      </div>
                      <p className="text-xs font-bold text-gray-600">
                        Qty: {item.quantity} <span className="mx-2 text-gray-300">|</span>{' '}
                        <span className="text-ink">{money(item.price)}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-6 space-y-4">
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <p>Subtotal</p>
                  <p>{money(cartTotal)}</p>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <p>Shipping</p>
                  <p>Calculated later</p>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                  <p className="text-sm font-black text-ink uppercase tracking-widest">Total</p>
                  <p className="text-2xl font-black text-ink">{money(cartTotal)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCheckout;
