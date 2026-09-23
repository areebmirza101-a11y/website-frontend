import { useEffect } from 'react';

// Build a full browser title like: "Velmoras Creation — Products"
const buildTitle = (pageTitle) => {
  const brand = window.__COMPANY_NAME__;
  if (!pageTitle) return brand || 'Store';
  if (!brand)    return pageTitle;
  return `${brand} — ${pageTitle}`;
};

const Seo = ({ title, description, keywords }) => {
  useEffect(() => {
    document.title = buildTitle(title);

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
    if (keywords) {
      let meta = document.querySelector('meta[name="keywords"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'keywords';
        document.head.appendChild(meta);
      }
      meta.content = keywords;
    }
    return () => {
      document.title = window.__DEFAULT_TITLE__ || window.__COMPANY_NAME__ || 'Store';
    };
  }, [title, description, keywords]);

  return null;
};

export default Seo;
