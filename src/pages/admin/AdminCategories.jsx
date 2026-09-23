import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Check, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categoryApi } from '../../api';
import { assetUrl } from '../../api/client';
import { useAdminTitle } from '../../components/admin/useAdminTitle';
import toast from 'react-hot-toast';
import { confirmAction } from '../../utils/confirmToast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);

  const load = () => categoryApi.listWithSubs().then(setCategories);
  useEffect(() => { load(); }, []);

  const remove = (id, name) => {
    confirmAction(`Delete category "${name}"? Products in it will be left uncategorized.`, async () => {
      try {
        await categoryApi.remove(id);
        load();
        toast.success('Category deleted');
      } catch (err) {
        toast.error(err.message);
      }
    });
  };

  const toggleHome = async (c) => {
    try {
      await categoryApi.update(c.id, { 
        name: c.name, 
        show_on_home: !c.show_on_home 
      });
      load();
      toast.success(c.show_on_home ? 'Removed from home page' : 'Added to home page');
    } catch (err) {
      toast.error(err.message);
    }
  };

  useAdminTitle('Categories');

  const topCategories = categories.filter(c => !c.parent_id);
  const subCategories = categories.flatMap(c => c.subcategories || []);

  const renderTable = (list, title, isSub) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2.5 py-1 rounded-full">{list.length}</span>
      </div>
      {list.length === 0 ? (
        <div className="p-12 text-center text-gray-400">No {title.toLowerCase()} yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 tracking-wider">
              <tr>
                <th className="text-left font-medium px-6 py-4 w-16">#</th>
                <th className="text-left font-medium px-6 py-4 w-24">Image</th>
                <th className="text-left font-medium px-6 py-4">Title</th>
                <th className="text-left font-medium px-6 py-4">Subtitle</th>
                {!isSub && <th className="text-left font-medium px-6 py-4">Subcategories</th>}
                {isSub && <th className="text-left font-medium px-6 py-4">Parent</th>}
                <th className="text-center font-medium px-6 py-4">Show on Home</th>
                <th className="text-right font-medium px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.map((c, index) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4">
                    {c.bg_image ? (
                      <div className="h-10 w-10 rounded-lg overflow-hidden border border-gray-200">
                        <img src={assetUrl(c.bg_image)} alt="" className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-400">No img</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{c.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500 truncate max-w-[200px]">{c.description || '—'}</p>
                  </td>
                  {!isSub && (
                    <td className="px-6 py-4">
                      {c.subcategories && c.subcategories.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {c.subcategories.map(sub => (
                            <span key={sub.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                              {sub.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                  )}
                  {isSub && (
                    <td className="px-6 py-4">
                      {(() => {
                        const parent = categories.find(p => p.id === c.parent_id);
                        return parent ? (
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                            {parent.name}
                          </span>
                        ) : <span className="text-sm text-red-500">Orphaned</span>;
                      })()}
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => toggleHome(c)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          c.show_on_home ? 'bg-gray-900' : 'bg-gray-200'
                        }`}
                      >
                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          c.show_on_home ? 'translate-x-5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        to={`/admin/categories/${c.id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-all"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button 
                        onClick={() => remove(c.id, c.name)} 
                        className="p-1.5 text-gray-400 hover:text-red-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <Link 
          to="/admin/categories/new" 
          className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Category
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="w-full flex flex-col self-start">
          {renderTable(topCategories, 'Main Categories', false)}
          {renderTable(subCategories, 'Subcategories', true)}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
