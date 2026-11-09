import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '../../api/client';
import BlogForm from './BlogForm';
import { useAdminTitle } from '../../components/admin/useAdminTitle';
import { confirmAction } from '../../utils/confirmToast';
import Seo from '../../components/Seo';

const AdminBlogs = () => {
  useAdminTitle('Blogs');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchBlogs = () => {
    setLoading(true);
    apiFetch('/blogs/admin', { auth: true })
      .then(setBlogs)
      .catch((err) => toast.error(err.message || 'Failed to fetch blogs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = (id, title) => {
    confirmAction(`Delete blog "${title || 'Post'}"?`, async () => {
      try {
        await apiFetch(`/blogs/${id}`, { method: 'DELETE', auth: true });
        toast.success('Blog deleted successfully');
        fetchBlogs();
      } catch (err) {
        toast.error(err.message || 'Failed to delete blog');
      }
    });
  };

  if (isFormOpen) {
    return (
      <BlogForm
        blog={editingBlog}
        onSave={() => {
          setIsFormOpen(false);
          setEditingBlog(null);
          fetchBlogs();
        }}
        onCancel={() => {
          setIsFormOpen(false);
          setEditingBlog(null);
        }}
      />
    );
  }

  return (
    <div className="w-full">
      <Seo title="Admin — Blogs" />

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blogs</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your blog posts and published articles.</p>
        </div>
        <button
          onClick={() => {
            setEditingBlog(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Add Blog
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-gray-100 shadow-xs">
          <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-xs border border-gray-100">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No blogs found</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Create your first blog post to engage your audience with fashion and store updates.
          </p>
          <button
            onClick={() => {
              setEditingBlog(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" /> Create First Blog
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left font-medium">Title</th>
                <th className="px-6 py-4 text-left font-medium">Author</th>
                <th className="px-6 py-4 text-left font-medium">Status</th>
                <th className="px-6 py-4 text-left font-medium">Date</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 text-sm">{blog.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">/{blog.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {blog.author || 'Admin'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        blog.is_published
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {blog.is_published ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" /> Published
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> Draft
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingBlog(blog);
                          setIsFormOpen(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-gray-900 bg-white border border-gray-200 rounded-lg shadow-xs hover:shadow transition-all"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id, blog.title)}
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

export default AdminBlogs;
