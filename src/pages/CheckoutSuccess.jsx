import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { orderApi } from '../api';
import { money } from '../lib/format';
import {
  Check,
  CheckCheck,
  Package,
  Truck,
  Home,
  ArrowRight,
  Mail,
  MapPin,
  CreditCard,
  AlertCircle,
  Copy,
  Calendar,
} from 'lucide-react';

const CheckoutSuccess = () => {
  const { clearCart } = useCart();
  const [params] = useSearchParams();
  const location = useLocation();
  const orderId = params.get('order');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [copied, setCopied] = useState(false);
  const titleRef = useRef(null);

  // Customer Name & Email available instantaneously via route state or API
  const customerName = order?.customer_name || location.state?.customerName || '';
  const customerEmail = order?.customer_email || location.state?.customerEmail || '';

  // Confetti pop originating directly from the "Thank You" title upwards and to the sides
  useEffect(() => {
    const colors = ['#10b981', '#d4af37', '#233b6e', '#3b82f6', '#ec4899', '#f59e0b'];

    const firePopFromTitle = () => {
      let originX = 0.5;
      let originY = 0.35;

      if (titleRef.current) {
        const rect = titleRef.current.getBoundingClientRect();
        originX = (rect.left + rect.width / 2) / window.innerWidth;
        originY = (rect.top + rect.height / 2) / window.innerHeight;
      }

      confetti({
        particleCount: 50,
        angle: 90, // shoots upwards
        spread: 120, // spreads wide to both left and right sides
        startVelocity: 35,
        gravity: 0.9,
        ticks: 140,
        origin: { x: originX, y: originY },
        colors,
        zIndex: 9999,
      });
    };

    // Burst 1: Pop directly from title area
    firePopFromTitle();

    // Burst 2: 700ms later (2 times max), then finishes
    const timer = setTimeout(() => {
      firePopFromTitle();
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  // Payment completed → empty the cart & fetch order details
  useEffect(() => {
    clearCart();

    if (orderId) {
      orderApi
        .get(orderId)
        .then((data) => {
          setOrder(data);
        })
        .catch((err) => {
          console.warn('Could not fetch order details for receipt:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleCopyRef = () => {
    const refText = orderId ? `#${orderId}` : '';
    if (refText) {
      navigator.clipboard.writeText(refText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Stepper class computation matching Admin panel statuses:
  // Admin statuses: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  const rawStatus = (order?.status || 'pending').toLowerCase();

  let s1Class = 'completed';
  let s2Class = 'active';
  let s3Class = '';
  let s4Class = '';

  if (rawStatus === 'shipped') {
    s1Class = 'completed';
    s2Class = 'completed';
    s3Class = 'active';
    s4Class = '';
  } else if (rawStatus === 'delivered') {
    s1Class = 'completed';
    s2Class = 'completed';
    s3Class = 'completed';
    s4Class = 'completed';
  } else if (rawStatus === 'processing' || rawStatus === 'pending') {
    s1Class = 'completed';
    s2Class = 'active';
    s3Class = '';
    s4Class = '';
  }

  const isStep2Done = ['shipped', 'delivered'].includes(rawStatus);
  const isStep3Done = rawStatus === 'delivered';
  const isStep4Done = rawStatus === 'delivered';

  // Format order date & estimated delivery
  const orderDateObj = order?.created_at ? new Date(order.created_at) : new Date();
  const formattedDate = orderDateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const estStart = new Date(orderDateObj);
  estStart.setDate(estStart.getDate() + 3);
  const estEnd = new Date(orderDateObj);
  estEnd.setDate(estEnd.getDate() + 5);
  const formatEst = (d) =>
    d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const estimatedDeliveryText = `${formatEst(estStart)} – ${formatEst(estEnd)}`;

  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        
        {/* ============================================================
            HERO SUCCESS CARD WITH ANIMATED AURA & 4-STEP TRACKER
            ============================================================ */}
        <div className="order-success-hero">
          {/* Animated Checkmark with Rotating Aura */}
          <div className="success-icon-wrapper">
            <Check className="w-10 h-10 text-white stroke-[3]" />
          </div>

          <div>
            <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-4 py-1.5 mb-3 text-xs font-black tracking-widest uppercase rounded-full shadow-xs">
              ORDER CONFIRMED
            </span>
          </div>

          {/* Thank You with Person's Name & Confetti Origin Anchor */}
          <h1
            ref={titleRef}
            className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight"
          >
            Thank You{customerName ? `, ${customerName}` : ''}!
          </h1>

          <p className="order-subtitle">
            Your order {orderId ? `(#${orderId}) ` : ''}has been received and is now being handcrafted & prepared by our creation team.
            {customerEmail ? (
              <> A full confirmation receipt has also been dispatched to <strong className="text-slate-800">{customerEmail}</strong>.</>
            ) : (
              <> A confirmation receipt has been sent to your email.</>
            )}
          </p>

          {/* Reference pill, copy button & Date */}
          {orderId && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <div className="inline-flex items-center gap-2 bg-white border border-gray-200/80 px-4 py-2 rounded-2xl shadow-xs text-xs font-semibold text-slate-700">
                <span className="font-black text-slate-900">📄 Order Ref: #{orderId}</span>
                <button
                  onClick={handleCopyRef}
                  className="inline-flex items-center gap-1 text-accent hover:text-accent-hover font-bold hover:underline transition-colors"
                  title="Copy reference number"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formattedDate}</span>
                </span>
              </div>
            </div>
          )}

          {/* Estimated Delivery Pill */}
          <div className="mt-3">
            <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-xs">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Estimated Delivery: {estimatedDeliveryText}</span>
            </span>
          </div>

          {/* Cancelled Alert if applicable */}
          {rawStatus === 'cancelled' && (
            <div className="mt-6 max-w-md mx-auto p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>This order has been cancelled by customer support or merchant.</span>
            </div>
          )}

          {/* 4-Step Dynamic Progress Stepper matching Admin Panel */}
          <div className="order-stepper">
            {/* Step 1: Order Placed */}
            <div className={`stepper-step ${s1Class}`}>
              <div className="stepper-circle">
                <Check className="w-4 h-4 text-white stroke-[3]" />
              </div>
              <span className="stepper-label">Order Placed</span>
            </div>

            {/* Step 2: Processing */}
            <div className={`stepper-step ${s2Class}`}>
              <div className="stepper-circle">
                {isStep2Done ? (
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                ) : (
                  <Package className="w-4 h-4" />
                )}
              </div>
              <span className="stepper-label">Processing</span>
            </div>

            {/* Step 3: Shipped */}
            <div className={`stepper-step ${s3Class}`}>
              <div className="stepper-circle">
                {isStep3Done ? (
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                ) : (
                  <Truck className="w-4 h-4" />
                )}
              </div>
              <span className="stepper-label">Shipped</span>
            </div>

            {/* Step 4: Delivered */}
            <div className={`stepper-step ${s4Class}`}>
              <div className="stepper-circle">
                {isStep4Done ? (
                  <CheckCheck className="w-4 h-4 text-white stroke-[3]" />
                ) : (
                  <Home className="w-4 h-4" />
                )}
              </div>
              <span className="stepper-label">Delivered</span>
            </div>
          </div>
        </div>

        {/* ============================================================
            ORDER DETAILS & SUMMARY BREAKDOWN
            ============================================================ */}
        {order && (
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6 sm:p-10 mb-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Reference Number</span>
                <p className="text-xl font-black text-ink">#{order.id}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block">Payment</span>
                  <span
                    className={`inline-block text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                      order.payment_status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {order.payment_status || 'pending'}
                  </span>
                </div>

                <div className="text-right pl-4 border-l border-gray-100">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block">Status</span>
                  <span className="inline-block text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
                    {order.status || 'pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery & Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/70 p-6 rounded-2xl border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-gray-200/60 shadow-xs text-accent">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-1">Shipping Address</h4>
                  <p className="text-sm font-bold text-slate-800">{order.customer_name}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{order.shipping_address}</p>
                  {(order.shipping_city || order.shipping_country) && (
                    <p className="text-xs text-gray-600">
                      {[order.shipping_city, order.shipping_country, order.shipping_zip].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-gray-200/60 shadow-xs text-accent">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-1">Payment Method</h4>
                  <p className="text-sm font-bold text-slate-800">
                    {order.payment_method === 'paypal' ? 'PayPal / Card Gateway' : 'Manual / Offline Arrangement'}
                  </p>
                  {order.paypal_capture_id && (
                    <p className="text-[11px] font-mono text-gray-500 mt-1">Capture ID: {order.paypal_capture_id}</p>
                  )}
                  {customerEmail && (
                    <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span>{customerEmail}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Ordered Items List */}
            {order.items && order.items.length > 0 && (
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>Items Ordered ({order.items.length})</span>
                </h3>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex-1">
                        <p className="text-sm font-black text-slate-800">{item.product_name || `Product #${item.product_id}`}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                          {item.size && <span>Size: <strong>{item.size}</strong></span>}
                          {item.color && <span>Color: <strong>{item.color}</strong></span>}
                          <span>Qty: <strong>{item.quantity}</strong></span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-ink">{money(item.price * item.quantity)}</p>
                        <p className="text-[11px] text-gray-400">{money(item.price)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm">
              <span className="font-black text-gray-600 uppercase tracking-wider">Total Paid</span>
              <span className="text-2xl font-black text-slate-900">{money(order.total)}</span>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-ink text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent hover:shadow-xl transition-all shadow-md active:scale-95"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-700 border border-gray-200/80 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-xs"
          >
            <span>Need Help? Contact Us</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CheckoutSuccess;
