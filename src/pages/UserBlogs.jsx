import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { apiFetch, assetUrl } from '../api/client';
import Seo from '../components/Seo';

const UserBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/blogs')
      .then(setBlogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white min-h-screen pt-12 pb-24">
      <Seo 
        title="Journal" 
        description="Read our latest thoughts, guides, and news about premium export apparel."
      />
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Our Journal</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-ink tracking-tight uppercase mb-6">
            Insights & Stories
          </h1>
          <p className="text-gray-500 text-lg">
            Discover style guides, industry news, and behind-the-scenes stories from our premium export collection.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No articles yet</h2>
            <p className="text-gray-500">Check back later for exciting news and updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link key={blog.id} to={`/blogs/${blog.slug}`} className="group block bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col">
                {blog.image_url ? (
                  <div className="aspect-[4/3] w-full overflow-hidden relative">
                    <img 
                      src={assetUrl(blog.image_url)} 
                      alt={blog.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] w-full bg-gray-100 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                    <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    {blog.author && (
                      <>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>{blog.author}</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-2xl font-black text-ink mb-4 leading-tight group-hover:text-accent transition-colors line-clamp-3">
                    {blog.title}
                  </h3>
                  <div className="mt-auto">
                    <span className="text-sm font-bold text-accent uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                      Read Article &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBlogs;
