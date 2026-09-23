import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { productApi } from '../../api';
import { money, productImage, categoryName } from '../../lib/format';
import { useAdminTitle } from '../../components/admin/useAdminTitle';
import toast from 'react-hot-toast';
import { confirmAction } from '../../utils/confirmToast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    productApi
      .list({ admin: true, limit: 200 })
      .then((d) => setProducts(d.products))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = (id, name) => {
    confirmAction(`Delete "${name}"? This cannot be undone.`, async () => {
      try {
        await productApi.remove(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success('Product deleted');
      } catch (err) {
        toast.error(err.message);
      }
    });
  };

  const toggleFeatured = async (p) => {
    try {
      await productApi.update(p.id, { 
        name: p.name,
        price: p.price,
        stock: p.stock,
        featured: !p.featured 
      });
      setProducts(products.map(prod => prod.id === p.id ? { ...prod, featured: !prod.featured } : prod));
      toast.success(p.featured ? 'Removed from home page' : 'Added to home page');
    } catch (err) {
      toast.error(err.message);
    }
  };

  useAdminTitle('Products');

  return (
    <div>
      <div className="flex items-center justify-end mb-8">
        <Link to="/admin/products/new" className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors">
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading…</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No products yet. Add your first one.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="text-left font-medium px-6 py-4">Product</th>
                <th className="text-left font-medium px-6 py-4">Category</th>
                <th className="text-left font-medium px-6 py-4">Price</th>
                <th className="text-left font-medium px-6 py-4">Stock</th>
                <th className="text-center font-medium px-6 py-4">Home</th>
                <th className="text-left font-medium px-6 py-4">Status</th>
                <th className="text-right font-medium px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={productImage(p)} alt="" className="w-12 h-14 object-cover rounded-lg bg-gray-100" />
                      <span className="font-medium text-gray-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{categoryName(p) || '—'}</td>
                  <td className="px-6 py-4 text-gray-900">{money(p.price)}</td>
                  <td className="px-6 py-4">
                    <span className={p.stock <= 5 ? 'text-red-600 font-medium' : 'text-gray-600'}>{p.stock}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={p.featured} 
                      onChange={() => toggleFeatured(p)} 
                      className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/products/${p.id}/edit`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Link>
                      <button onClick={() => handleDelete(p.id, p.name)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
