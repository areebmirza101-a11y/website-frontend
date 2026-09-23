import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, X, Upload, Star } from 'lucide-react';
import { productApi, categoryApi, adminSizeGuideApi } from '../../api';
import { assetUrl } from '../../api/client';
import { useAdminTitle } from '../../components/admin/useAdminTitle';

const empty = {
  name: '', description: '', price: '', sku: '', material: '',
  sizes: '', colors: '', stock: 0, main_category_id: '', sub_category_id: '', featured: false, show_in_hero: false, active: true, size_guide_id: ''
};

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [detailFiles, setDetailFiles] = useState([]);
  const [detailPreviews, setDetailPreviews] = useState([]);
  const [detailPrices, setDetailPrices] = useState({});
  const [sizeGuides, setSizeGuides] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      categoryApi.listWithSubs(),
      adminSizeGuideApi.list().catch(() => []) // fetch size guides
    ]).then(([cats, guides]) => {
      setCategories(cats);
      setSizeGuides(guides);
      if (isEdit) {
        productApi.get(id).then((p) => {
          let mainCatId = '';
          let subCatId = '';
          if (p?.category_id) {
            const cat = cats.find(c => c.id === p.category_id);
            if (cat) {
              if (cat.parent_id) {
                mainCatId = cat.parent_id;
                subCatId = cat.id;
              } else {
                mainCatId = cat.id;
              }
            }
          }
          setForm({
            name: p?.name || '',
            description: p?.description || '',
            price: p?.price || '',
            sku: p?.sku || '',
            material: p?.material || '',
            sizes: Array.isArray(p?.sizes) ? p.sizes.join(', ') : (p?.sizes || ''),
            colors: Array.isArray(p?.colors) ? p.colors.join(', ') : (p?.colors || ''),
            stock: p?.stock ?? 0,
            main_category_id: mainCatId,
            sub_category_id: subCatId,
            featured: !!p?.featured,
            show_in_hero: !!p?.show_in_hero,
            active: !!p?.active,
            size_guide_id: p?.size_guide_id || ''
          });
          setExistingImages(p?.images || []);
          const main = (p?.images || []).find((i) => i.is_main);
          if (main) setMainImagePreview(assetUrl(main.url));
        }).catch(err => {
          console.error('Error fetching product:', err);
          setError('Failed to load product data: ' + err.message);
        });
      }
    }).catch(console.error);
  }, [id, isEdit]);

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMainImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setMainImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDetailFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setDetailFiles(files);
    const previews = files.map((f) => {
      const reader = new FileReader();
      reader.onloadend = () => reader.result;
      reader.readAsDataURL(f);
      return reader.result;
    });
    setDetailPreviews(previews);
  };

  const handleDetailPriceChange = (index, value) => {
    setDetailPrices((prev) => ({ ...prev, [index]: value }));
  };

  const removeExistingImage = async (imageId) => {
    await productApi.removeImage(imageId);
    setExistingImages((prev) => prev.filter((i) => i.id !== imageId));
    setMainImagePreview(null);
  };

  const setAsMain = async (imageId) => {
    await productApi.setMainImage(imageId);
    setExistingImages((prev) =>
      prev.map((i) => ({ ...i, is_main: i.id === imageId, is_primary: i.id === imageId }))
    );
    const main = existingImages.find((i) => i.id === imageId);
    if (main) setMainImagePreview(assetUrl(main.url));
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price) || 0,
        stock: parseInt(form.stock, 10) || 0,
        category_id: form.sub_category_id || form.main_category_id || null,
        size_guide_id: form.size_guide_id || null,
        sizes: typeof form.sizes === 'string' ? form.sizes.split(',').map((s) => s.trim()).filter(Boolean) : form.sizes,
        colors: typeof form.colors === 'string' ? form.colors.split(',').map((c) => c.trim()).filter(Boolean) : form.colors,
        sku: form.sku || undefined,
      };
      const saved = isEdit ? await productApi.update(id, payload) : await productApi.create(payload);

      if (mainImageFile) {
        await productApi.uploadMainImage(saved.id, mainImageFile);
      }
      if (detailFiles.length) {
        await productApi.uploadDetailImages(saved.id, detailFiles);
      }

      navigate('/admin/products');
    } catch (err) {
      setError(err.message || 'Failed to save product');
      setBusy(false);
    }
  };

  const input = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-gray-900 focus:border-gray-900 outline-none transition-colors';
  const label = 'block text-sm font-medium text-gray-700 mb-1';

  useAdminTitle(isEdit ? 'Edit Product' : 'New Product');

  return (
    <div className="max-w-3xl">
      <Link to="/admin/products" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Products
      </Link>

      {error && <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      <form onSubmit={submit} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div>
            <label className={label}>Name</label>
            <input required value={form.name} onChange={set('name')} className={input} />
          </div>
          <div>
            <label className={label}>Description</label>
            <textarea rows={4} value={form.description} onChange={set('description')} className={input} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Price (USD)</label>
              <input type="number" step="0.01" required value={form.price} onChange={set('price')} className={input} />
            </div>
            <div>
              <label className={label}>Stock</label>
              <input type="number" value={form.stock} onChange={set('stock')} className={input} />
            </div>
            <div>
              <label className={label}>SKU</label>
              <input value={form.sku || (form.name ? generateSku(form.name) : '')} readOnly className={`${input} bg-gray-50 text-gray-500`} placeholder="Auto-generated from name" />
              <p className="text-xs text-gray-400 mt-1">Auto-generated from product name</p>
            </div>
            <div>
              <label className={label}>Category</label>
              <select 
                value={form.main_category_id} 
                onChange={(e) => {
                  setForm(f => ({ ...f, main_category_id: e.target.value, sub_category_id: '' }));
                }} 
                className={input}
              >
                <option value="">— None —</option>
                {categories.filter(c => !c.parent_id).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            {form.main_category_id && categories.find(c => String(c.id) === String(form.main_category_id))?.subcategories?.length > 0 && (
              <div>
                <label className={label}>Subcategory</label>
                <select 
                  value={form.sub_category_id} 
                  onChange={set('sub_category_id')} 
                  className={input}
                >
                  <option value="">— None —</option>
                  {categories.find(c => String(c.id) === String(form.main_category_id))?.subcategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div>
            <label className={label}>Material</label>
            <input value={form.material} onChange={set('material')} className={input} placeholder="e.g. 100% Cotton" />
          </div>
          <div>
            <label className={label}>Size Guide</label>
            <select value={form.size_guide_id} onChange={set('size_guide_id')} className={input}>
              <option value="">— Inherit from Category or None —</option>
              {sizeGuides.map((sg) => (
                <option key={sg.id} value={sg.id}>{sg.title}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Sizes (comma-separated)</label>
              <input value={form.sizes} onChange={set('sizes')} className={input} placeholder="S, M, L, XL" />
              <p className="text-xs text-gray-400 mt-1">Leave blank to auto-extract from Size Guide.</p>
            </div>
            <div>
              <label className={label}>Colors (comma-separated)</label>
              <input value={form.colors} onChange={set('colors')} className={input} placeholder="Black, White" />
            </div>
          </div>
          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.featured} onChange={set('featured')} className="rounded" /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.show_in_hero} onChange={set('show_in_hero')} className="rounded" /> Show in Hero
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.active} onChange={set('active')} className="rounded" /> Active (visible in store)
            </label>
          </div>
        </div>

        {/* Main Image */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold text-ink mb-4">Main Image (Hero)</h2>
          {mainImagePreview && (
            <div className="mb-4 relative">
              <img src={mainImagePreview} alt="Main preview" className="w-full h-48 object-cover rounded-xl" />
              {isEdit && (
                <button type="button" onClick={() => { setMainImageFile(null); setMainImagePreview(null); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
          {isEdit && existingImages.find((i) => i.is_main) && !mainImagePreview && (
            <div className="mb-4">
              <img src={assetUrl(existingImages.find((i) => i.is_main).url)} alt="Current main" className="w-full h-48 object-cover rounded-xl" />
            </div>
          )}
          <label className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-accent transition-colors ${mainImagePreview ? 'hidden' : ''}`}>
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">Click to upload main image</span>
            <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
          </label>
        </div>

        {/* Detail Images */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold text-ink mb-4">Detail Images (Gallery)</h2>
          {existingImages.filter((i) => !i.is_main).length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {existingImages.filter((i) => !i.is_main).map((img) => (
                <div key={img.id} className="relative w-20 h-24">
                  <img src={assetUrl(img.url)} alt="" className="w-full h-full object-cover rounded-lg" />
                  {img.is_main && <span className="absolute top-1 left-1 bg-accent text-white text-[10px] px-1 rounded">Main</span>}
                  <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1 rounded">
                    {img.price ? `$${parseFloat(img.price).toFixed(2)}` : '—'}
                  </div>
                  <button type="button" onClick={() => removeExistingImage(img.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                    <X className="h-3 w-3" />
                  </button>
                  {!img.is_main && (
                    <button type="button" onClick={() => setAsMain(img.id)} className="absolute bottom-1 right-1 bg-gray-800/70 text-white rounded p-1">
                      <Star className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          <input type="file" multiple accept="image/*" onChange={handleDetailFilesChange} className="text-sm text-gray-600 mb-3" />
          {detailFiles.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {detailFiles.map((file, idx) => (
                <div key={idx} className="relative w-20 h-24">
                  <img src={detailPreviews[idx] || URL.createObjectURL(file)} alt={`Detail ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                  <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1 rounded">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Price"
                      value={detailPrices[idx] || ''}
                      onChange={(e) => handleDetailPriceChange(idx, e.target.value)}
                      className="w-16 bg-black/40 text-white text-[10px] px-1 py-0.5 rounded border border-gray-600 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400">Optional: set a specific price per detail image. Leave blank to use the product's base price.</p>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={busy} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-60">
            {busy ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
          <Link to="/admin/products" className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

const generateSku = (name) =>
  name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toUpperCase();

export default ProductForm;
