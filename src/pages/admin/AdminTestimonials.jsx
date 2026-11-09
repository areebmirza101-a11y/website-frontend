import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, assetUrl } from '../../api/client';
import { Plus, Edit2, Trash2, MessageSquare, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminTitle } from '../../components/admin/useAdminTitle';
import { confirmAction } from '../../utils/confirmToast';
import Seo from '../../components/Seo';

const AdminTestimonials = () => {
  useAdminTitle('Testimonials');
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/admin/testimonials', { auth: true });
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load testimonials');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, name) => {
    confirmAction(`Delete testimonial by "${name || 'Customer'}"?`, async () => {
      try {
        await apiFetch(`/admin/testimonials/${id}`, { method: 'DELETE', auth: true });
        toast.success('Testimonial deleted successfully');
        fetchTestimonials();
      } catch (err) {
        toast.error(err.message || 'Failed to delete testimonial');
      }
    });
  };

  return (
    <div className="w-full">
      <Seo title="Admin — Testimonials" />

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Testimonials</h2>
          <p className="text-sm text-gray-500 mt-1">Manage reviews and client testimonials shown across the store.</p>
        </div>
        <button
          onClick={() => navigate('/admin/testimonials/new')}
          className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-gray-100 shadow-xs">
          <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-xs border border-gray-100">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No testimonials yet</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Add client feedback and reviews to highlight your luxury craftsmanship on the storefront.
          </p>
          <button
            onClick={() => navigate('/admin/testimonials/new')}
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" /> Add First Testimonial
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium w-16">Image</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Role / Status</th>
                <th className="px-6 py-4 font-medium">Subject</th>
                <th className="px-6 py-4 font-medium">Feedback</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    {t.image_url ? (
                      <img
                        src={assetUrl(t.image_url)}
                        alt={t.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextSibling) {
                            e.currentTarget.nextSibling.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div
                      style={{ display: t.image_url ? 'none' : 'flex' }}
                      className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 items-center justify-center font-bold text-xs text-gray-600 uppercase"
                    >
                      {t.name ? t.name.charAt(0) : 'T'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {t.role || 'Verified Buyer'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {t.subject || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-sm truncate" title={t.content}>
                    {t.content}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/testimonials/${t.id}/edit`)}
                        className="p-1.5 text-gray-400 hover:text-gray-900 bg-white border border-gray-200 rounded-lg shadow-xs hover:shadow transition-all"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id, t.name)}
                        className="p-1.5 text-gray-400 hover:text-red-600 bg-white border border-gray-200 rounded-lg shadow-xs hover:shadow transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
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
};

export default AdminTestimonials;
