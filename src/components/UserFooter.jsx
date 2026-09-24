import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { settingsApi, categoryApi } from '../api';

const UserFooter = () => {
  const [logoUrl, setLogoUrl] = useState(null);
  const [companyName, setCompanyName] = useState('Velmoras');
  const [socials, setSocials] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    settingsApi.getPublic().then(s => {
      if (s?.app_logo) setLogoUrl(s.app_logo);
      if (s?.company_name) setCompanyName(s.company_name);
      
      let parsedSocials = [];
      if (s?.social_links) {
        parsedSocials = typeof s.social_links === 'string' ? JSON.parse(s.social_links) : s.social_links;
      }
      setSocials(parsedSocials);
    }).catch(() => {});
    
    categoryApi.listWithSubs().then(setCategories).catch(() => {});
  }, []);

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-auto">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            {logoUrl ? (
              <img src={logoUrl} alt={companyName} className="h-10 w-auto object-contain mb-4 block" />
            ) : (
              <span className="font-bold text-2xl tracking-[0.2em] text-ink block mb-4">{companyName.toUpperCase()}<span className="text-accent">.</span></span>
            )}
            <p className="text-gray-500 text-sm mb-6 max-w-xs">
              Global apparel export. Thoughtfully made clothing for men, women and kids — shipped worldwide.
            </p>
            <div className="flex flex-wrap gap-4">
              {socials.map((social, idx) => (
                <a key={idx} href={social.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-gray-400 hover:text-accent transition-colors">
                  {social.label.toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-ink mb-4">Shop</h4>
            <ul className="space-y-3">
              <li><Link to="/products" className="text-gray-500 hover:text-accent text-sm transition-colors">All Products</Link></li>
              {categories.filter(c => !c.parent_id).map(c => (
                <li key={c.id}>
                  <Link to={`/products?category=${c.slug}`} className="text-gray-500 hover:text-accent text-sm transition-colors">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-ink mb-4">Customer Care</h4>
            <ul className="space-y-3">
              <li><Link to="/size-guide" className="text-gray-500 hover:text-accent text-sm transition-colors">Size Guide</Link></li>
              <li><Link to="/shipping" className="text-gray-500 hover:text-accent text-sm transition-colors">Shipping &amp; Returns</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-accent text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-ink mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-gray-500 hover:text-accent text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-accent text-sm transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link to="/returns" className="text-gray-500 hover:text-accent text-sm transition-colors">Return &amp; Refund</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Velmoras Creation. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link to="/privacy" className="text-gray-400 text-xs hover:text-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 text-xs hover:text-accent transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;
