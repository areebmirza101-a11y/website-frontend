import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, X, Eye, Sparkles, Tag, ShoppingBag, Layers, Heart, ArrowRight, Copy, Check, Mail, Loader2 } from 'lucide-react';
import { apiFetch, assetUrl } from '../../api/client';
import { categoryApi, productApi, adminCouponApi, letterboxApi } from '../../api';
import { useAdminTitle } from '../../components/admin/useAdminTitle';
import Seo from '../../components/Seo';
import toast from 'react-hot-toast';

const AdminSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [previewTab, setPreviewTab] = useState('popup'); // 'popup' | 'product'
  const [imagePreview, setImagePreview] = useState(null);
  const [previewProductId, setPreviewProductId] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    discount_type: 'percentage',
    discount_value: '20',
    active: true,
    start_date: '',
    end_date: '',
    applies_to: 'all',
    target_ids: [],
    banner_title: '',
    banner_subtitle: '',
    banner_image_file: null,
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useAdminTitle('Sales & Promotions');

  // Main Tab State
  const [activeMainTab, setActiveMainTab] = useState('sales'); // 'sales' | 'coupons'
  const [coupons, setCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponSubmitting, setCouponSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // Promotional Email Confirmation State
  const [promoConfirmModal, setPromoConfirmModal] = useState(null);
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);

  const handleSendPromotionalEmail = async () => {
    if (!promoConfirmModal) return;
    setIsSendingBroadcast(true);
    try {
      const discountText =
        promoConfirmModal.discountType === 'percentage'
          ? `${promoConfirmModal.discountValue}% OFF`
          : `${promoConfirmModal.discountValue} OFF`;

      const subject = `🎉 Special Offer: ${promoConfirmModal.saleName} is Live! (${discountText})`;
      const message = `We are excited to bring you an exclusive promotional event at Velmoras Creation!\n\n${promoConfirmModal.saleName} is now active!\nEnjoy ${discountText} on our handcrafted cinema costumes and bespoke tailoring.\n${promoConfirmModal.bannerSubtitle ? `${promoConfirmModal.bannerSubtitle}\n` : ''}\nVisit our storefront now to explore the limited collection before this offer ends!`;

      await letterboxApi.sendBroadcast({
        subject,
        message,
        recipientEmails: 'all',
      });

      toast.success('Promotional email broadcast sent to all subscribers & customers!');
      setPromoConfirmModal(null);
    } catch (err) {
      toast.error(err.message || 'Failed to send broadcast email');
    } finally {
      setIsSendingBroadcast(false);
    }
  };

  const [couponForm, setCouponForm] = useState({
    code: '',
    name: '',
    discount_type: 'percentage',
    discount_value: '10',
    min_order_amount: '0',
    start_date: '',
    end_date: '',
    active: true,
  });

  const fetchCoupons = async () => {
    setCouponsLoading(true);
    try {
      const data = await adminCouponApi.list();
      setCoupons(data || []);
    } catch (e) {
      toast.error('Failed to load coupons');
    } finally {
      setCouponsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied "${code}" to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!couponForm.code.trim()) {
      toast.error('Coupon code is required');
      return;
    }
    setCouponSubmitting(true);
    try {
      await adminCouponApi.create(couponForm);
      toast.success('Coupon created successfully!');
      setIsCouponModalOpen(false);
      setCouponForm({
        code: '',
        name: '',
        discount_type: 'percentage',
        discount_value: '10',
        min_order_amount: '0',
        start_date: '',
        end_date: '',
        active: true,
      });
      fetchCoupons();
    } catch (err) {
      toast.error(err.message || 'Error creating coupon');
    } finally {
      setCouponSubmitting(false);
    }
  };

  const handleToggleCoupon = async (id) => {
    try {
      await adminCouponApi.toggle(id);
      toast.success('Coupon status updated');
      fetchCoupons();
    } catch (err) {
      toast.error('Failed to toggle coupon status');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await adminCouponApi.delete(id);
        toast.success('Coupon deleted');
        fetchCoupons();
      } catch (err) {
        toast.error('Failed to delete coupon');
      }
    }
  };


  const fetchSales = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/promotions');
      setSales(data || []);
    } catch (e) {
      toast.error('Failed to load sales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
    productApi.list({ limit: 1000 }).then(res => setProducts(res.products || [])).catch(() => {});
    categoryApi.list().then(setCategories).catch(() => {});
  }, []);

  const handleOpenModal = (sale = null) => {
    if (sale) {
      setEditingSale(sale);
      setForm({
        name: sale.name || '',
        discount_type: sale.discount_type || 'percentage',
        discount_value: sale.discount_value || '',
        active: sale.active !== false,
        start_date: sale.start_date ? sale.start_date.split('T')[0] : '',
        end_date: sale.end_date ? sale.end_date.split('T')[0] : '',
        applies_to: sale.applies_to || 'all',
        target_ids: sale.target_ids || [],
        banner_title: sale.banner_title || '',
        banner_subtitle: sale.banner_subtitle || '',
        banner_image_file: null,
      });
      setImagePreview(sale.banner_image_url ? assetUrl(sale.banner_image_url) : null);
    } else {
      setEditingSale(null);
      setForm({
        name: '',
        discount_type: 'percentage',
        discount_value: '20',
        active: true,
        start_date: '',
        end_date: '',
        applies_to: 'all',
        target_ids: [],
        banner_title: '',
        banner_subtitle: '',
        banner_image_file: null,
      });
      setImagePreview(null);
    }
    setPreviewTab('popup');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSale(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({ ...prev, banner_image_file: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(form).forEach(key => {
      if (key === 'target_ids') {
        fd.append(key, JSON.stringify(form[key]));
      } else if (key === 'banner_image_file' && form[key]) {
        fd.append(key, form[key]);
      } else if (form[key] !== null && form[key] !== undefined && key !== 'banner_image_file') {
        fd.append(key, form[key]);
      }
    });

    try {
      const savedSaleName = form.name;
      const savedDiscountType = form.discount_type;
      const savedDiscountValue = form.discount_value;
      const savedSubtitle = form.banner_subtitle;
      const savedStart = form.start_date;
      const savedEnd = form.end_date;

      if (editingSale) {
        await apiFetch(`/promotions/${editingSale.id}`, { method: 'PUT', body: fd, isFormData: true, auth: true });
        toast.success('Sale updated successfully');
      } else {
        await apiFetch('/promotions', { method: 'POST', body: fd, isFormData: true, auth: true });
        toast.success('Sale created successfully');
      }
      handleCloseModal();
      fetchSales();

      // Trigger Promotional Email Popup
      setPromoConfirmModal({
        saleName: savedSaleName,
        discountType: savedDiscountType,
        discountValue: savedDiscountValue,
        bannerSubtitle: savedSubtitle,
        startDate: savedStart,
        endDate: savedEnd,
      });
    } catch (err) {
      toast.error('Error saving sale');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await apiFetch(`/promotions/${id}`, { method: 'DELETE', auth: true });
        toast.success('Sale deleted');
        fetchSales();
      } catch (err) {
        toast.error('Error deleting sale');
      }
    }
  };

  const toggleTargetId = (id) => {
    const numId = parseInt(id, 10);
    setForm(prev => {
      const exists = prev.target_ids.includes(numId);
      if (exists) return { ...prev, target_ids: prev.target_ids.filter(tid => tid !== numId) };
      return { ...prev, target_ids: [...prev.target_ids, numId] };
    });
  };

  // Preview Calculations with Real Store Dress / Product
  const selectedProduct = (previewProductId && products.find(p => p.id === previewProductId)) || products[0] || null;
  const sampleBasePrice = selectedProduct?.price ? parseFloat(selectedProduct.price) : 240;
  const sampleName = selectedProduct?.name || 'Star Wars Obi-Wan Kenobi Jedi Knight Cosplay Costume Set';
  const mainImgObj = selectedProduct?.images?.find(i => i.is_main) || selectedProduct?.images?.[0];
  const sampleImage = mainImgObj?.url
    ? assetUrl(mainImgObj.url)
    : 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop&q=80';
  const heroDressBanner = imagePreview || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop';

  const numDiscount = parseFloat(form.discount_value) || 0;
  const discountedPrice = form.discount_type === 'percentage'
    ? Math.max(0, sampleBasePrice * (1 - Math.min(numDiscount, 100) / 100)).toFixed(2)
    : Math.max(0, sampleBasePrice - numDiscount).toFixed(2);
  const savingsAmount = (sampleBasePrice - parseFloat(discountedPrice)).toFixed(2);
  const discountBadge = form.discount_type === 'percentage'
    ? `${form.discount_value || 0}% OFF`
    : `${form.discount_value || 0} OFF`;

  return (
    <div className="w-[90%] max-w-[1920px] mx-auto min-w-0">
      <Seo title="Admin — Sales" />
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {activeMainTab === 'sales' ? 'Manage Sales & Promotions' : 'Coupons & Promo Codes'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {activeMainTab === 'sales'
              ? 'Create automatic site-wide, category, or product level sales with live preview.'
              : 'Create and manage promotional discount voucher codes for checkout.'}
          </p>
        </div>
        {activeMainTab === 'sales' ? (
          <button
            onClick={() => handleOpenModal()}
            className="bg-gray-900 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition font-medium shadow-xs text-sm"
          >
            <Plus className="h-4 w-4" /> New Sale
          </button>
        ) : (
          <button
            onClick={() => setIsCouponModalOpen(true)}
            className="bg-gray-900 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition font-medium shadow-xs text-sm"
          >
            <Plus className="h-4 w-4" /> New Coupon Code
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-6">
        <button
          type="button"
          onClick={() => setActiveMainTab('sales')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeMainTab === 'sales'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Sales Campaigns ({sales.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveMainTab('coupons')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeMainTab === 'coupons'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Tag className="w-4 h-4" /> Promo & Coupon Codes ({coupons.length})
        </button>
      </div>

      {activeMainTab === 'sales' ? (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading sales...</div>
        ) : sales.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No sales found. Create your first sale!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Sale Name</th>
                  <th className="px-6 py-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Applies To</th>
                  <th className="px-6 py-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold text-xs text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{sale.name}</p>
                      <p className="text-xs text-gray-500">{sale.start_date ? new Date(sale.start_date).toLocaleDateString() : 'Immediate'} → {sale.end_date ? new Date(sale.end_date).toLocaleDateString() : 'No End Date'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
                        {sale.discount_type === 'percentage' ? `${sale.discount_value}% OFF` : `${sale.discount_value} OFF`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-700 capitalize">
                      {sale.applies_to === 'all' ? 'Entire Store' : sale.applies_to}
                    </td>
                    <td className="px-6 py-4">
                      {sale.active ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">Active</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleOpenModal(sale)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit Sale">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(sale.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete Sale">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    ) : (
      /* Coupons Tab View */
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {couponsLoading ? (
          <div className="p-12 text-center text-gray-400">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-sm font-semibold mb-2">No coupon codes yet</p>
            <p className="text-xs text-gray-500 mb-4">Create your first promo code to boost checkouts.</p>
            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition"
            >
              Create Coupon
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Coupon Code</th>
                  <th className="px-6 py-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Name / Purpose</th>
                  <th className="px-6 py-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Min. Spend</th>
                  <th className="px-6 py-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold text-xs text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200 tracking-wider">
                          {coupon.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(coupon.code)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                          title="Copy Code"
                        >
                          {copiedCode === coupon.code ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 text-xs">{coupon.name}</p>
                      <p className="text-[11px] text-gray-400">
                        {coupon.start_date ? new Date(coupon.start_date).toLocaleDateString() : 'Immediate'} →{' '}
                        {coupon.end_date ? new Date(coupon.end_date).toLocaleDateString() : 'No expiry'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {coupon.discount_type === 'percentage'
                          ? `${coupon.discount_value}% OFF`
                          : `${coupon.discount_value} OFF`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-600">
                      {coupon.min_order_amount > 0 ? `${coupon.min_order_amount}` : 'None'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleToggleCoupon(coupon.id)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold transition ${
                          coupon.active
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {coupon.active ? '● Active' : '○ Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Coupon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )}

      {/* 2-COLUMN MODAL WITH LIVE PREVIEW */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-100">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 sm:px-8 sm:py-5 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    {editingSale ? 'Edit Promotion & Banner' : 'Create New Promotion'}
                  </h3>
                  <p className="text-xs text-gray-400">Configure discount details with real-time storefront preview</p>
                </div>
              </div>
              <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Content: 2-Column Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
              
              {/* LEFT COLUMN: FORM INPUTS */}
              <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
                <form id="saleForm" onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Sale Name & Active */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                        Sale Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-gray-900 transition"
                        placeholder="e.g. Black Friday VIP Sale"
                      />
                    </div>
                    <div className="pb-1">
                      <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl hover:bg-gray-100/80 transition">
                        <input
                          type="checkbox"
                          checked={form.active}
                          onChange={e => setForm({...form, active: e.target.checked})}
                          className="w-4 h-4 rounded text-gray-900 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-gray-800">Active Now</span>
                      </label>
                    </div>
                  </div>

                  {/* Discount Type & Value */}
                  <div className="grid grid-cols-2 gap-4 bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Discount Type</label>
                      <select
                        value={form.discount_type}
                        onChange={e => setForm({...form, discount_type: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-gray-900 transition cursor-pointer"
                      >
                        <option value="percentage">Percentage Discount (%)</option>
                        <option value="flat">Fixed Cash Discount ($)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Discount Value</label>
                      <div className="relative">
                        <input
                          required
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.discount_value}
                          onChange={e => setForm({...form, discount_value: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-gray-900 transition"
                          placeholder="e.g. 20"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                          {form.discount_type === 'percentage' ? '%' : '$'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Start Date (Optional)</label>
                      <input
                        type="date"
                        value={form.start_date}
                        onChange={e => setForm({...form, start_date: e.target.value})}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-gray-900 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">End Date (Optional)</label>
                      <input
                        type="date"
                        value={form.end_date}
                        onChange={e => setForm({...form, end_date: e.target.value})}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-gray-900 transition"
                      />
                    </div>
                  </div>

                  {/* Applies To Selector */}
                  <div className="pt-2 border-t border-gray-100">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Promotion Scope</label>
                    <div className="flex flex-wrap gap-4 mb-3">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                        <input
                          type="radio"
                          name="applies_to"
                          value="all"
                          checked={form.applies_to === 'all'}
                          onChange={() => setForm({...form, applies_to: 'all', target_ids: []})}
                          className="text-gray-900 focus:ring-0"
                        />
                        Entire Store
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                        <input
                          type="radio"
                          name="applies_to"
                          value="categories"
                          checked={form.applies_to === 'categories'}
                          onChange={() => setForm({...form, applies_to: 'categories', target_ids: []})}
                          className="text-gray-900 focus:ring-0"
                        />
                        Specific Categories
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                        <input
                          type="radio"
                          name="applies_to"
                          value="products"
                          checked={form.applies_to === 'products'}
                          onChange={() => setForm({...form, applies_to: 'products', target_ids: []})}
                          className="text-gray-900 focus:ring-0"
                        />
                        Specific Products
                      </label>
                    </div>

                    {form.applies_to === 'categories' && (
                      <div className="bg-gray-50 p-3.5 rounded-2xl max-h-40 overflow-y-auto space-y-1.5 border border-gray-200">
                        <p className="text-[11px] font-bold text-gray-500 uppercase mb-1">Select Categories:</p>
                        {categories.map(c => (
                          <label key={c.id} className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-gray-100 text-xs cursor-pointer hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={form.target_ids.includes(c.id)}
                              onChange={() => toggleTargetId(c.id)}
                              className="w-4 h-4 rounded text-gray-900 focus:ring-0"
                            />
                            <span className="font-semibold text-gray-800">{c.name}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {form.applies_to === 'products' && (
                      <div className="bg-gray-50 p-3.5 rounded-2xl max-h-40 overflow-y-auto space-y-1.5 border border-gray-200">
                        <p className="text-[11px] font-bold text-gray-500 uppercase mb-1">Select Products:</p>
                        {products.map(p => (
                          <label key={p.id} className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-gray-100 text-xs cursor-pointer hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={form.target_ids.includes(p.id)}
                              onChange={() => toggleTargetId(p.id)}
                              className="w-4 h-4 rounded text-gray-900 focus:ring-0"
                            />
                            <span className="font-semibold text-gray-800 truncate">{p.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Banner Info */}
                  <div className="pt-2 border-t border-gray-100 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">Storefront Modal Popup Banner</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Banner Title (Headline)</label>
                        <input
                          type="text"
                          value={form.banner_title}
                          onChange={e => setForm({...form, banner_title: e.target.value})}
                          className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-gray-900"
                          placeholder="e.g. Exclusive Season Special"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Banner Subtitle / Hook</label>
                        <input
                          type="text"
                          value={form.banner_subtitle}
                          onChange={e => setForm({...form, banner_subtitle: e.target.value})}
                          className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-gray-900"
                          placeholder="e.g. Enjoy up to 20% off all handcrafted replicas"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Upload Banner Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs outline-none bg-gray-50 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800 cursor-pointer"
                      />
                    </div>
                  </div>

                </form>
              </div>

              {/* RIGHT COLUMN: LIVE CUSTOMER PREVIEW */}
              <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-50/60 flex flex-col justify-between space-y-5">
                <div>
                  {/* Preview Header & Tabs */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-600">
                      <Eye className="w-4 h-4 text-accent" />
                      <span>Live Customer Preview</span>
                    </div>

                    <div className="inline-flex rounded-xl bg-gray-200/80 p-0.5 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setPreviewTab('popup')}
                        className={`px-3 py-1 rounded-lg transition-all ${previewTab === 'popup' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                      >
                        Popup Banner
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewTab('product')}
                        className={`px-3 py-1 rounded-lg transition-all ${previewTab === 'product' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                      >
                        Product Card
                      </button>
                    </div>
                  </div>

                  {/* TAB 1: POPUP BANNER PREVIEW */}
                  {previewTab === 'popup' && (
                    <div className="mt-4">
                      <p className="text-[11px] text-gray-400 mb-2">Live preview of the luxury modal shown to visitors on your store:</p>
                      
                      <div className="bg-white rounded-3xl shadow-xl border border-gray-200/70 overflow-hidden relative">
                        {/* Fake Close Button */}
                        <div className="absolute top-3 right-3 z-10 w-7 h-7 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-700 shadow-xs">
                          <X className="w-3.5 h-3.5" />
                        </div>

                        {/* Real Dress Banner Image */}
                        <div className="h-44 w-full relative overflow-hidden bg-gray-900">
                          <img
                            src={heroDressBanner}
                            alt="Banner Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop&q=80';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="p-6 text-center space-y-3">
                          <span className="inline-block bg-accent/10 text-accent font-black tracking-[0.2em] text-[9px] uppercase px-3 py-1 rounded-full border border-accent/20">
                            SPECIAL OFFER • {discountBadge}
                          </span>

                          <h4 className="text-xl font-black text-gray-900 tracking-tight leading-snug">
                            {form.banner_title || form.name || 'Your Special Sale Headline'}
                          </h4>

                          <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
                            {form.banner_subtitle || `Don't miss out! Enjoy ${discountBadge} discount on your favorite bespoke designs today.`}
                          </p>

                          <div className="pt-2">
                            <span className="inline-block w-full bg-accent text-white font-bold px-6 py-3 rounded-xl tracking-widest text-xs uppercase shadow-md shadow-accent/20">
                              SHOP THE SALE <ArrowRight className="h-3.5 w-3.5 ml-1.5 inline-block" />
                            </span>
                          </div>

                          <div className="text-[10px] text-gray-400 pt-1 font-medium">
                            Scope: {form.applies_to === 'all' ? 'Entire Store' : `${form.applies_to} (${form.target_ids.length} selected)`}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: PRODUCT CARD DISCOUNT PREVIEW (EXACT HOME PAGE DRESS CARD) */}
                  {previewTab === 'product' && (
                    <div className="mt-4 space-y-3">
                      {/* Product Selector for Dress Preview */}
                      {products.length > 0 && (
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                            Preview With Dress From Store:
                          </label>
                          <select
                            value={selectedProduct?.id || ''}
                            onChange={(e) => setPreviewProductId(parseInt(e.target.value, 10))}
                            className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-gray-900 cursor-pointer text-gray-800 truncate"
                          >
                            {products.map(p => (
                              <option key={p.id} value={p.id}>
                                {p.name} (${parseFloat(p.price || 0).toFixed(2)})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <p className="text-[11px] text-gray-400">Exact home page dress card with live discount badge and price:</p>

                      <div className="bg-white rounded-[2rem] p-3 shadow-lg border border-gray-200 max-w-xs mx-auto">
                        {/* Real Dress Image on Aspect 4/5 */}
                        <div className="relative aspect-[4/5] rounded-[1.5rem] bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                          <img
                            src={sampleImage}
                            alt={sampleName}
                            className="w-full h-full object-cover mix-blend-multiply"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop&q=80';
                            }}
                          />
                          
                          {/* Wishlist Heart */}
                          <div className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-xs border border-gray-100">
                            <Heart className="w-4 h-4 text-gray-400" />
                          </div>

                          {/* Home Page Official Gold Sale Badge */}
                          {numDiscount > 0 && (
                            <span className="absolute top-3 left-3 bg-[#BA9B74] text-white text-[10px] font-black tracking-widest uppercase px-3.5 py-1.5 rounded-full shadow-md z-10">
                              {discountBadge}
                            </span>
                          )}
                        </div>

                        {/* Dress Info Matching Home Page */}
                        <div className="p-3 space-y-1.5">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#BA9B74]">
                            Cinema & Cosplay Dress
                          </span>
                          <h5 className="text-xs font-bold text-gray-900 line-clamp-1">
                            {sampleName}
                          </h5>
                          
                          <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                            <div className="flex items-baseline gap-2">
                              <span className="text-base font-extrabold text-gray-900">
                                ${discountedPrice}
                              </span>
                              {numDiscount > 0 && (
                                <span className="text-xs text-gray-400 line-through font-semibold">
                                  ${sampleBasePrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                            {numDiscount > 0 && (
                              <span className="text-[11px] font-bold text-emerald-600">
                                Save ${savingsAmount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Scope & Date Footer Info */}
                <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs space-y-1 text-gray-500">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Status:</span>
                    <span className={form.active ? 'text-emerald-600 font-bold' : 'text-gray-400 font-semibold'}>
                      {form.active ? 'Active & Visible' : 'Draft / Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Duration:</span>
                    <span>
                      {form.start_date || 'Immediate'} → {form.end_date || 'Continuous'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Modal Actions Footer */}
            <div className="px-6 py-4 sm:px-8 border-t border-gray-100 bg-gray-50/80 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="saleForm"
                className="px-6 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition flex items-center gap-2 shadow-xs"
              >
                <Save className="h-4 w-4" /> Save Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSales;
