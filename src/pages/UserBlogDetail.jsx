import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag } from 'lucide-react';
import { apiFetch, assetUrl } from '../api/client';
import Seo from '../components/Seo';

const UserBlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch(`/blogs/${slug}`)
      .then(setBlog)
      .catch(() => {
        navigate('/404');
      })
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) return null;

  const fullImageUrl = blog.image_url ? assetUrl(blog.image_url) : '';
  const currentUrl = window.location.href;

  // Generate FAQ Schema if enabled
  let faqSchema = null;
  if (blog.custom_faq_schema) {
    faqSchema = blog.custom_faq_schema;
  } else if (blog.faq_schema_enabled && blog.faqs && blog.faqs.length > 0) {
    faqSchema = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": blog.faqs.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }
      }))
    });
  }

  return (
    <article className="bg-white min-h-screen pt-12 pb-24">
      <Seo 
        title={blog.meta_title || blog.title}
        description={blog.meta_description || blog.description || blog.content.replace(/<[^>]+>/g, '').substring(0, 160) + '...'}
        keywords={blog.meta_keywords || ''}
        image={fullImageUrl}
        url={currentUrl}
      />
      
      {/* Custom Article JSON-LD from Admin */}
      {blog.meta_schema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: blog.meta_schema }} />
      ) : (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": blog.meta_title || blog.title,
            "image": fullImageUrl ? [fullImageUrl] : [],
            "datePublished": blog.created_at,
            "dateModified": blog.updated_at,
            "author": [{
              "@type": "Person",
              "name": blog.author || window.__COMPANY_NAME__ || 'Admin'
            }]
          })}
        </script>
      )}

      {/* FAQ Schema */}
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-accent uppercase tracking-wider mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Journal
        </Link>
        
        <div className="mb-12">
          {blog.category && (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-6">
              <Tag className="w-3.5 h-3.5" />
              {blog.category}
            </span>
          )}
          <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">
            <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            {blog.author && (
              <>
                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                <span className="text-accent">{blog.author}</span>
              </>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-ink tracking-tight uppercase leading-[1.1]">
            {blog.title}
          </h1>
        </div>
      </div>

      {blog.image_url && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="aspect-[21/9] w-full rounded-[2rem] overflow-hidden bg-gray-100 shadow-2xl">
            <img 
              src={assetUrl(blog.image_url)} 
              alt={blog.image_alt || blog.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Render HTML content safely */}
        <div 
          className="prose prose-lg prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-hr:border-gray-200"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* FAQs Display */}
        {blog.faqs && blog.faqs.length > 0 && (
          <div className="mt-16 pt-16 border-t border-gray-100">
            <h3 className="text-3xl font-black text-ink uppercase tracking-tight mb-8">Frequently Asked Questions</h3>
            <div className="space-y-6">
              {blog.faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-6 md:p-8">
                  <h4 className="text-xl font-bold text-ink mb-3">{faq.question}</h4>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default UserBlogDetail;
