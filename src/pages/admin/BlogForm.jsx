import { useState } from 'react';
import { Save, ArrowLeft, Upload, X, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch, assetUrl } from '../../api/client';

const CATEGORIES = ['News', 'Guides', 'Updates', 'Artificial Intelligence', 'Digital Marketing', 'Software Development'];

const BlogForm = ({ blog, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState('content');
  
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    content: blog?.content || '',
    author: blog?.author || '',
    is_published: blog ? blog.is_published : false,
    // New Fields
    description: blog?.description || '',
    category: blog?.category || '',
    image_alt: blog?.image_alt || '',
    meta_title: blog?.meta_title || '',
    meta_description: blog?.meta_description || '',
    meta_keywords: blog?.meta_keywords || '',
    meta_schema: blog?.meta_schema || '',
    faqs: blog?.faqs || [],
    faq_schema_enabled: blog ? blog.faq_schema_enabled : true,
    custom_faq_schema: blog?.custom_faq_schema || '',
    related_articles: blog?.related_articles || [],
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(blog?.image_url ? assetUrl(blog.image_url) : null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAddFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const handleUpdateFaq = (index, field, value) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index][field] = value;
    setFormData({ ...formData, faqs: newFaqs });
  };

  const handleRemoveFaq = (index) => {
    const newFaqs = [...formData.faqs];
    newFaqs.splice(index, 1);
    setFormData({ ...formData, faqs: newFaqs });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const method = blog ? 'PUT' : 'POST';
    const url = blog ? `/blogs/${blog.id}` : '/blogs';

    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (typeof v === 'object' || typeof v === 'boolean') {
        fd.append(k, JSON.stringify(v));
      } else {
        fd.append(k, v || '');
      }
    });
    
    if (imageFile) {
      fd.append('image', imageFile);
    }

    apiFetch(url, {
      method,
      body: fd,
      auth: true,
    })
      .then(() => {
        toast.success(`Blog ${blog ? 'updated' : 'created'} successfully`);
        onSave();
      })
      .catch((err) => toast.error(err.message || 'Failed to save blog'))
      .finally(() => setLoading(false));
  };

  const generateSlug = () => {
    if (formData.title && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-500" />
        </button>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-ink">
            {blog ? 'Edit Blog' : 'New Blog'}
          </h1>
          <p className="text-gray-500 mt-1">SEO-Optimized Blog Post Editor</p>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-8 space-x-8">
        {['content', 'seo', 'faqs'].map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === tab ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {tab === 'content' ? 'Content & Media' : tab === 'seo' ? 'SEO Settings' : 'FAQs & Schema'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          
          {/* CONTENT TAB */}
          {activeTab === 'content' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Blog Page Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    onBlur={generateSlug}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none"
                    placeholder="E.g. How much does it cost to make an app?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">URL / Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none"
                    placeholder="e.g. custom-app-cost"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none"
                    placeholder="Author Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none bg-white"
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="flex items-center h-full pt-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
                    />
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Status: Published</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Short Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none"
                  placeholder="A brief excerpt for blog listing pages..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Cover Image</label>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="relative border-2 border-dashed border-gray-200 rounded-xl hover:border-accent transition-colors bg-gray-50/50">
                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <div className="px-4 py-8 text-center">
                          <Upload className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                          <p className="text-sm font-medium text-gray-900">Upload new image</p>
                        </div>
                      </div>
                    </div>
                    {imagePreview && (
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Image Alt Text</label>
                  <input
                    type="text"
                    value={formData.image_alt}
                    onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none"
                    placeholder="Descriptive text for screen readers/SEO"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Content * (Markdown / HTML)</label>
                <textarea
                  required
                  rows={15}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none font-mono text-sm"
                  placeholder="Write your comprehensive blog content here..."
                />
              </div>
            </div>
          )}

          {/* SEO TAB */}
          {activeTab === 'seo' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Meta Title</label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none"
                  placeholder="Optimal length: 50-60 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Meta Description</label>
                <textarea
                  rows={3}
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none"
                  placeholder="Optimal length: 150-160 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Meta Keywords</label>
                <input
                  type="text"
                  value={formData.meta_keywords}
                  onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none"
                  placeholder="Comma separated keywords"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Article Schema (JSON-LD)</label>
                <textarea
                  rows={6}
                  value={formData.meta_schema}
                  onChange={(e) => setFormData({ ...formData, meta_schema: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none font-mono text-xs"
                  placeholder="You can paste raw JSON schema here. It will be injected into the page <head>."
                />
              </div>
            </div>
          )}

          {/* FAQS TAB */}
          {activeTab === 'faqs' && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">FAQ Schema Markup Settings</h3>
                    <p className="text-sm text-gray-500">Auto-generate JSON-LD FAQ schema for better SEO visibility.</p>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Enable Auto Schema</span>
                    <input
                      type="checkbox"
                      checked={formData.faq_schema_enabled}
                      onChange={(e) => setFormData({ ...formData, faq_schema_enabled: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Custom FAQ Schema Override (Optional)</label>
                  <textarea
                    rows={4}
                    value={formData.custom_faq_schema}
                    onChange={(e) => setFormData({ ...formData, custom_faq_schema: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent outline-none font-mono text-xs"
                    placeholder="If provided, this replaces the auto-generated FAQ schema entirely."
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Blog FAQs ({formData.faqs.length})</label>
                  <button type="button" onClick={handleAddFaq} className="text-sm font-bold text-accent hover:text-ink flex items-center gap-1">
                    <Plus className="w-4 h-4" /> ADD FAQ
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.faqs.map((faq, index) => (
                    <div key={index} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                      <div className="flex-1 space-y-4">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => handleUpdateFaq(index, 'question', e.target.value)}
                          placeholder={`FAQ #${index + 1} Question`}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-accent outline-none font-bold"
                        />
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => handleUpdateFaq(index, 'answer', e.target.value)}
                          placeholder="Answer..."
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-accent outline-none text-sm"
                        />
                      </div>
                      <button type="button" onClick={() => handleRemoveFaq(index)} className="text-gray-400 hover:text-red-500 transition-colors p-2 h-fit">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {formData.faqs.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4 italic">No FAQs added yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl font-bold tracking-widest text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-accent text-white px-8 py-3 rounded-xl font-bold tracking-widest text-sm hover:bg-ink transition-colors flex items-center gap-2 shadow-lg shadow-accent/20 disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
            {blog ? 'UPDATE BLOG' : 'PUBLISH BLOG'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
