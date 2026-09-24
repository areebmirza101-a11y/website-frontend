import { useEffect } from 'react';

// Build a full browser title like: "Velmoras Creation — Products"
const buildTitle = (pageTitle) => {
  const brand = window.__COMPANY_NAME__;
  if (!pageTitle) return brand || 'Store';
  if (!brand)    return pageTitle;
  return `${brand} — ${pageTitle}`;
};

const setMetaTag = (attrName, attrValue, content) => {
  if (!content) return;
  let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attrName, attrValue);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

  const Seo = ({ title, description, keywords, image, url, jsonLd }) => {
  useEffect(() => {
    const fullTitle = buildTitle(title);
    document.title = fullTitle;

    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    
    // Open Graph
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', 'website');
    if (image) setMetaTag('property', 'og:image', image);
    if (url) setMetaTag('property', 'og:url', url);
    
    // Twitter
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    if (image) setMetaTag('name', 'twitter:image', image);

    // JSON-LD Structured Data
    if (jsonLd) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.innerHTML = JSON.stringify(jsonLd);
    }

    return () => {
      document.title = window.__DEFAULT_TITLE__ || window.__COMPANY_NAME__ || 'Store';
      
      const script = document.querySelector('script[type="application/ld+json"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [title, description, keywords, image, url, jsonLd]);

  return null;
};

export default Seo;
