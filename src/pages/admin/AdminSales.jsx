import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, X } from 'lucide-react';
import { apiFetch } from '../../api/client';
import { categoryApi, productApi } from '../../api';
import { useAdminTitle } from '../../components/admin/useAdminTitle';
import Seo from '../../components/Seo';
import toast from 'react-hot-toast';

const AdminSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    discount_type: 'percentage',
    discount_value: '',
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
        active: sale.active,
        start_date: sale.start_date ? sale.start_date.split('T')[0] : '',
        end_date: sale.end_date ? sale.end_date.split('T')[0] : '',
        applies_to: sale.applies_to || 'all',
        target_ids: sale.target_ids || [],
        banner_title: sale.banner_title || '',
        banner_subtitle: sale.banner_subtitle || '',
        banner_image_file: null,
      });
    } else {
      setEditingSale(null);
      setForm({
        name: '',
        discount_type: 'percentage',
        discount_value: '',
        active: true,
        start_date: '',
        end_date: '',
        applies_to: 'all',
        target_ids: [],
        banner_title: '',
        banner_subtitle: '',
        banner_image_file: null,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSale(null);
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
      if (editingSale) {
        await apiFetch(`/promotions/${editingSale.id}`, { method: 'PUT', body: fd, isFormData: true });
        toast.success('Sale updated successfully');
      } else {
        await apiFetch('/promotions', { method: 'POST', body: fd, isFormData: true });
        toast.success('Sale created successfully');
      }
      handleCloseModal();
      fetchSales();
    } catch (err) {
      toast.error('Error saving sale');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await apiFetch(`/promotions/${id}`, { method: 'DELETE' });
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

  return (
    <div className="max-w-7xl mx-auto">
      <Seo title="Admin — Sales" />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Sales & Promotions</h2>
        <button onClick={() => handleOpenModal()} className="bg-gray-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition">
          <Plus className="h-4 w-4" /> New Sale
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading sales...</div>
        ) : sales.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No sales found. Create your first sale!</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 font-medium text-sm text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 font-medium text-sm text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-4 font-medium text-sm text-gray-500 uppercase tracking-wider">Applies To</th>
                <th className="px-6 py-4 font-medium text-sm text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-medium text-sm text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{sale.name}</p>
                    <p className="text-xs text-gray-500">{sale.start_date ? new Date(sale.start_date).toLocaleDateString() : 'N/A'} - {sale.end_date ? new Date(sale.end_date).toLocaleDateString() : 'No End Date'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {sale.discount_type === 'percentage' ? `${sale.discount_value}% OFF` : `$${sale.discount_value} OFF`}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 capitalize">
                    {sale.applies_to === 'all' ? 'Entire Store' : sale.applies_to}
                  </td>
                  <td className="px-6 py-4">
                    {sale.active ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => handleOpenModal(sale)} className="text-gray-400 hover:text-blue-600 transition">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(sale.id)} className="text-gray-400 hover:text-red-600 transition">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold">{editingSale ? 'Edit Sale' : 'Create New Sale'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="saleForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sale Name</label>
                    <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-1 focus:ring-gray-900" placeholder="e.g. Summer Sale" />
                  </div>
                  <div className="flex items-center mt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} className="w-4 h-4 rounded text-gray-900" />
                      <span className="text-sm font-medium text-gray-700">Sale is Active</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                    <select value={form.discount_type} onChange={e => setForm({...form, discount_type: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-1 focus:ring-gray-900">
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Amount ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                    <input required type="number" min="0" step="0.01" value={form.discount_value} onChange={e => setForm({...form, discount_value: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-1 focus:ring-gray-900" placeholder="e.g. 20" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (Optional)</label>
                    <input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-1 focus:ring-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                    <input type="date" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-1 focus:ring-gray-900" />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Applies To</label>
                  <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="applies_to" value="all" checked={form.applies_to === 'all'} onChange={() => setForm({...form, applies_to: 'all', target_ids: []})} /> Entire Store
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="applies_to" value="categories" checked={form.applies_to === 'categories'} onChange={() => setForm({...form, applies_to: 'categories', target_ids: []})} /> Specific Categories
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="applies_to" value="products" checked={form.applies_to === 'products'} onChange={() => setForm({...form, applies_to: 'products', target_ids: []})} /> Specific Products
                    </label>
                  </div>

                  {form.applies_to === 'categories' && (
                    <div className="bg-gray-50 p-4 rounded-xl max-h-48 overflow-y-auto space-y-2 border border-gray-200">
                      {categories.map(c => (
                        <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={form.target_ids.includes(c.id)} onChange={() => toggleTargetId(c.id)} className="w-4 h-4 rounded text-gray-900" />
                          <span className="text-sm">{c.name}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {form.applies_to === 'products' && (
                    <div className="bg-gray-50 p-4 rounded-xl max-h-48 overflow-y-auto space-y-2 border border-gray-200">
                      {products.map(p => (
                        <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={form.target_ids.includes(p.id)} onChange={() => toggleTargetId(p.id)} className="w-4 h-4 rounded text-gray-900" />
                          <span className="text-sm">{p.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Home Page Banner (Optional)</h4>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Banner Title</label>
                      <input type="text" value={form.banner_title} onChange={e => setForm({...form, banner_title: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none" placeholder="e.g. Summer Blowout Sale" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Banner Subtitle</label>
                      <input type="text" value={form.banner_subtitle} onChange={e => setForm({...form, banner_subtitle: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none" placeholder="e.g. Up to 50% Off Everything" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Upload Banner Image</label>
                      <input type="file" accept="image/*" onChange={e => setForm({...form, banner_image_file: e.target.files[0]})} className="w-full px-4 py-2 border rounded-xl outline-none bg-gray-50" />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={handleCloseModal} className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition">Cancel</button>
              <button type="submit" form="saleForm" className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition flex items-center gap-2">
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
