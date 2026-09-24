import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '../../api/client';
import BlogForm from './BlogForm';

const AdminBlogs = () => {
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

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      apiFetch(`/blogs/${id}`, { method: 'DELETE', auth: true })
        .then(() => {
          toast.success('Blog deleted successfully');
          fetchBlogs();
        })
        .catch((err) => toast.error(err.message || 'Failed to delete blog'));
    }
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
    <div className="p-8 max-w-[1536px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-ink">Blogs</h1>
          <p className="text-gray-500 mt-1">Manage your blog posts and articles.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-accent text-white px-6 py-3 rounded-xl font-bold tracking-widest text-sm hover:bg-ink transition-colors flex items-center gap-2 shadow-lg shadow-accent/20"
        >
          <Plus className="w-5 h-5" /> NEW BLOG
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-2">No blogs found</h3>
          <p className="text-gray-500 mb-6">Create your first blog post to engage your audience.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-ink">{blog.title}</div>
                    <div className="text-sm text-gray-500">/{blog.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {blog.author || 'Admin'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wider ${blog.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {blog.is_published ? (
                        <><CheckCircle className="w-3 h-3" /> Published</>
                      ) : (
                        <><XCircle className="w-3 h-3" /> Draft</>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-3">
                    <button
                      onClick={() => {
                        setEditingBlog(blog);
                        setIsFormOpen(true);
                      }}
                      className="text-accent hover:text-ink transition-colors p-2 hover:bg-gray-100 rounded-lg inline-block"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg inline-block"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
