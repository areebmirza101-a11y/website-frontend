import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, X, Upload } from 'lucide-react';
import { categoryApi } from '../../api';
import { assetUrl } from '../../api/client';
import { useAdminTitle } from '../../components/admin/useAdminTitle';

const empty = {
  name: '', description: '', parent_id: '', bg_image: '', show_on_home: true,
};

const CategoryForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [topCategories, setTopCategories] = useState([]);
  const [bgFile, setBgFile] = useState(null);
  const [bgPreview, setBgPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('main'); // 'main' or 'sub'

  useEffect(() => {
    categoryApi.listWithSubs().then((cats) => {
      const topCats = cats.filter(c => !c.parent_id);
      setTopCategories(topCats);
      
      if (isEdit) {
        let editingCat = null;
        for (const cat of cats) {
          if (cat.id.toString() === id) {
            editingCat = cat;
            break;
          }
          if (cat.subcategories) {
            const sub = cat.subcategories.find(s => s.id.toString() === id);
            if (sub) {
              editingCat = sub;
              break;
            }
          }
        }
        
        if (editingCat) {
          setForm({
            name: editingCat.name || '',
            description: editingCat.description || '',
            parent_id: editingCat.parent_id || '',
            bg_image: editingCat.bg_image || '',
            show_on_home: editingCat.show_on_home !== false,
          });
          
          if (editingCat.parent_id) {
            setActiveTab('sub');
          }
          
          if (editingCat.bg_image) {
            setBgPreview(assetUrl(editingCat.bg_image));
          }
        } else {
          setError('Category not found.');
        }
      }
    }).catch(console.error);
  }, [id, isEdit]);

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const handleBgImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBgFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setBgPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const save = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const payload = {
        name: form.name,
        description: form.description,
        parent_id: activeTab === 'sub' ? (form.parent_id || null) : null,
        show_on_home: form.show_on_home,
      };

      if (!payload.name) {
        throw new Error('Category name is required');
      }
      
      if (activeTab === 'sub' && !payload.parent_id) {
        throw new Error('Please select a parent category for the subcategory.');
      }

      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== '') fd.append(k, v);
      });
      if (bgFile) fd.append('bg_image', bgFile);

      if (isEdit) {
        await categoryApi.update(id, payload); // Note: categoryApi.update stringifies if we pass plain object.
        // Wait, if bgFile is selected, we MUST send FormData?
        // But categoryApi.update currently just uses apiFetch which checks if body is FormData? No, apiFetch handles FormData natively!
        // Actually, let's use categoryApi.update for now, wait, categoryApi.update expects body. apiFetch handles it!
      } else {
        // categoryApi.create does the same.
        // Let's modify api/index.js if needed.
      }
      
      // Let's just pass plain object if no image, or let's see how categoryApi is defined.
      // In frontend/src/api/index.js, `create: (body) => apiFetch('/categories', { method: 'POST', body, auth: true })`
      // `apiFetch` handles FormData correctly!
      const bodyToSend = bgFile ? fd : payload;

      if (isEdit) {
        await categoryApi.update(id, bodyToSend);
      } else {
        await categoryApi.create(bodyToSend);
      }
      navigate('/admin/categories');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  const input = "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors";
  const label = "block text-sm font-medium text-gray-900 mb-1.5";
  
  useAdminTitle(isEdit ? 'Edit Category' : 'New Category');

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/categories" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isEdit ? 'Edit Category' : 'New Category'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/categories" className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Cancel
          </Link>
          <button
            onClick={save}
            disabled={busy}
            className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {busy ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between">
          <p className="text-sm">{error}</p>
          <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      <form onSubmit={save} className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Basic Information</h2>
            
            <div className="flex bg-gray-200 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  if (isEdit) return; 
                  setActiveTab('main');
                  setForm(f => ({ ...f, parent_id: '' }));
                }}
                className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${activeTab === 'main' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'} ${isEdit && activeTab !== 'main' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Main Category
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isEdit) return;
                  setActiveTab('sub');
                  setForm(f => ({ ...f, parent_id: topCategories[0]?.id || '' }));
                }}
                className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${activeTab === 'sub' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'} ${isEdit && activeTab !== 'sub' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Subcategory
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={label}>Name</label>
                <input required value={form.name} onChange={set('name')} className={input} placeholder="Category Name" />
              </div>
              
              <div className="md:col-span-2">
                <label className={label}>Description</label>
                <textarea rows={3} value={form.description} onChange={set('description')} className={input} placeholder="Brief description of this category..." />
              </div>
            </div>
          </div>
        </div>
        
        {activeTab === 'sub' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-900">Parent Category</h2>
            </div>
            <div className="p-6">
              <label className={label}>Select Parent</label>
              <select required value={form.parent_id} onChange={set('parent_id')} className={input}>
                <option value="" disabled>Select a main category</option>
                {topCategories.map(pc => (
                  <option key={pc.id} value={pc.id}>{pc.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-900">Media & Settings</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className={label}>Background Image</label>
              <div className="mt-2 flex items-start gap-6">
                <div className="flex-1">
                  <div className="relative border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-900 transition-colors bg-gray-50/50">
                    <input type="file" accept="image/*" onChange={handleBgImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="px-6 py-10 text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                      <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                </div>
                {bgPreview && (
                  <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                    <img src={bgPreview} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => { setBgFile(null); setBgPreview(form.bg_image ? assetUrl(form.bg_image) : null); }} className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg shadow-sm hover:bg-white text-gray-700 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.show_on_home} onChange={set('show_on_home')} className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Show on Home Page</p>
                  <p className="text-xs text-gray-500 mt-0.5">Display this category as a card on the storefront home page.</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
