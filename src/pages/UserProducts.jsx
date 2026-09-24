import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productApi, categoryApi } from '../api';
import { useSales } from '../context/SalesContext';

const UserProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const onSaleParam = searchParams.get('on_sale') === 'true';
  const sortParam = searchParams.get('sort') || 'newest';

  const { getProductSale, activeSales } = useSales();
  const [categories, setCategories] = useState([]);
  const [expandedCats, setExpandedCats] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryApi.listWithSubs().then(cats => {
      setCategories(cats);
      // Auto-expand the category if a subcategory is selected
      const selectedCat = cats.find(c => c.slug === categoryParam);
      if (selectedCat && selectedCat.parent_id) {
        setExpandedCats(prev => ({ ...prev, [selectedCat.parent_id]: true }));
      }
    }).catch(() => { });
  }, [categoryParam]);

  useEffect(() => {
    setLoading(true);
    productApi
      .list({ category: categoryParam, search: searchParam, limit: 1000 })
      .then((d) => {
        let prods = d.products || [];
        if (onSaleParam) {
           prods = prods.filter(p => getProductSale(p) !== null);
        }
        
        // Sorting
        prods = [...prods].sort((a, b) => {
          if (sortParam === 'price_asc') {
            const priceA = getProductSale(a) ? getProductSale(a).salePrice : a.price;
            const priceB = getProductSale(b) ? getProductSale(b).salePrice : b.price;
            return priceA - priceB;
          }
          if (sortParam === 'price_desc') {
            const priceA = getProductSale(a) ? getProductSale(a).salePrice : a.price;
            const priceB = getProductSale(b) ? getProductSale(b).salePrice : b.price;
            return priceB - priceA;
          }
          if (sortParam === 'trending') {
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
          }
          // Default: newest
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setProducts(prods);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [categoryParam, searchParam, onSaleParam, sortParam, activeSales]);

  const handleCategoryClick = (slug) => {
    if (slug === 'all') searchParams.delete('category');
    else searchParams.set('category', slug);
    searchParams.delete('on_sale');
    setSearchParams(searchParams);
  };

  const handleSaleClick = () => {
    searchParams.set('on_sale', 'true');
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  const toggleExpand = (id) => {
    setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSortChange = (e) => {
    searchParams.set('sort', e.target.value);
    setSearchParams(searchParams);
  };

  const topCategories = categories.filter(c => !c.parent_id);

  return (
    <div className="bg-gray-50 min-h-screen pt-16 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Header */}
        <div className="mb-16 border-b border-gray-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="inline-block text-accent font-bold tracking-[0.2em] text-[10px] uppercase mb-4 bg-accent/10 px-3 py-1 rounded-full">
              Explore The Collection
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-ink uppercase">
              {searchParam ? `Results for "${searchParam}"` : onSaleParam ? 'Sale Offers' : 'All Products'}
            </h1>
          </div>
          <div className="flex flex-col md:items-end gap-4">
            <p className="text-gray-500 font-medium text-sm tracking-widest uppercase">
              {searchParam ? `${products.length} items found` : onSaleParam ? 'Limited time discounts' : 'Everyday luxury'}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Sort by:</span>
              <select
                value={sortParam}
                onChange={handleSortChange}
                className="bg-white border border-gray-200 text-ink text-sm font-medium rounded-xl px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="trending">Trending</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          {/* Minimalist Sidebar */}
          <aside className="w-full md:w-56 flex-shrink-0">
            <div className="sticky top-28 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="font-black text-ink mb-8 uppercase tracking-[0.2em] text-xs">Categories</h3>
              <ul className="space-y-5">
                <li>
                  <button
                    onClick={() => handleCategoryClick('all')}
                    className={`text-xs tracking-widest uppercase transition-all duration-300 w-full text-left ${categoryParam === 'all' ? 'text-accent font-black translate-x-2' : 'text-gray-500 font-bold hover:text-ink hover:translate-x-1'
                      }`}
                  >
                    All Collection
                  </button>
                </li>
                {activeSales.length > 0 && (
                  <li>
                    <button
                      onClick={handleSaleClick}
                      className={`text-xs tracking-widest uppercase transition-all duration-300 w-full text-left flex items-center justify-between ${onSaleParam ? 'text-red-500 font-black translate-x-2' : 'text-red-400 font-bold hover:text-red-600 hover:translate-x-1'
                        }`}
                    >
                      On Sale <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full">HOT</span>
                    </button>
                  </li>
                )}
                {topCategories.map((c) => {
                  const hasSubs = c.subcategories && c.subcategories.length > 0;
                  const isExpanded = expandedCats[c.id];
                  const isSelected = categoryParam === c.slug;
                  return (
                    <li key={c.id} className="flex flex-col">
                      <div className="flex items-center justify-between group">
                        <button
                          onClick={() => hasSubs ? toggleExpand(c.id) : handleCategoryClick(c.slug)}
                          className={`text-xs tracking-widest uppercase transition-all duration-300 text-left flex-1 ${isSelected && !hasSubs ? 'text-accent font-black translate-x-2' : 'text-gray-500 font-bold hover:text-ink hover:translate-x-1'
                            }`}
                        >
                          {c.name}
                        </button>
                        {hasSubs && (
                          <button
                            onClick={() => toggleExpand(c.id)}
                            className="p-1.5 text-gray-400 hover:text-ink transition-colors rounded-full hover:bg-gray-50"
                          >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                      {hasSubs && isExpanded && (
                        <ul className="pl-5 mt-4 space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                          {c.subcategories.map(sub => (
                            <li key={sub.id} className="relative">
                              <span className="absolute left-[-20px] top-[7px] w-3 h-[2px] bg-gray-100" />
                              <button
                                onClick={() => handleCategoryClick(sub.slug)}
                                className={`text-[10px] tracking-widest uppercase block w-full text-left transition-all duration-300 ${categoryParam === sub.slug ? 'text-accent font-black' : 'text-gray-400 font-bold hover:text-ink'
                                  }`}
                              >
                                {sub.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded-[2rem] bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col p-2">
                    <div className="flex-1 bg-gray-50 rounded-[1.5rem] animate-pulse" />
                    <div className="p-4 mt-2 space-y-3">
                      <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse" />
                      <div className="h-3 bg-gray-100 rounded w-1/3 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (() => {
              const selectedCat = categories.find(c => c.slug === categoryParam);
              const isParentWithSubs = selectedCat && !selectedCat.parent_id && selectedCat.subcategories && selectedCat.subcategories.length > 0;

              if (isParentWithSubs) {
                return (
                  <div className="py-12 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                    <div className="text-center mb-10">
                      <h3 className="text-2xl font-black text-ink mb-2 uppercase tracking-widest">Explore {selectedCat.name}</h3>
                      <p className="text-gray-500 font-medium">Select a category below to view products.</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {selectedCat.subcategories.map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => handleCategoryClick(sub.slug)}
                          className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-accent hover:shadow-md transition-all group"
                        >
                          <span className="text-lg font-semibold text-ink group-hover:text-accent mb-1">{sub.name}</span>
                          <span className="text-sm text-muted">View Collection &rarr;</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              if (products.length === 0) {
                return (
                  <div className="text-center py-32 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black text-ink mb-3 uppercase tracking-widest">No products found</h3>
                    <p className="text-gray-500 font-medium mb-8">Try adjusting your category or search terms.</p>
                    {(categoryParam !== 'all' || searchParam) && (
                      <button onClick={() => setSearchParams({})} className="bg-ink text-white font-bold py-3 px-8 rounded-xl hover:bg-accent hover:shadow-lg transition-all active:scale-95 text-sm tracking-widest uppercase">
                        Clear all filters
                      </button>
                    )}
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProducts;
