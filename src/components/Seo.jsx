import { useEffect } from 'react';

// Build a full browser title like: "Velmoras Creation — Star Wars Kylo Ren Costume"
const buildTitle = (pageTitle) => {
  const brand = window.__COMPANY_NAME__ || 'Velmoras Creation';
  if (!pageTitle) return brand;
  if (pageTitle.includes(brand)) return pageTitle;
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

const setCanonicalTag = (url) => {
  if (!url) return;
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
};

const Seo = ({
  title,
  description = 'Velmoras Creation - Premium custom-made cosplay costumes, handcrafted cinema outfits, tunics, robes & accessories with worldwide shipping.',
  keywords = 'cosplay costumes, custom cosplay, handcrafted costumes, cinema outfits, bespoke tailoring, Velmoras Creation',
  image = 'https://www.velmorascreation.com/logo.png',
  url,
  type = 'website',
  noindex = false,
  jsonLd,
}) => {
  useEffect(() => {
    const fullTitle = buildTitle(title);
    document.title = fullTitle;

    const currentUrl = url || window.location.href;

    // Meta Description & Keywords
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    // Canonical link
    setCanonicalTag(currentUrl);

    // Open Graph
    setMetaTag('property', 'og:site_name', window.__COMPANY_NAME__ || 'Velmoras Creation');
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', type);
    if (image) setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:url', currentUrl);

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    if (image) setMetaTag('name', 'twitter:image', image);

    // JSON-LD Structured Data
    if (jsonLd) {
      let script = document.querySelector('script#dynamic-json-ld');
      if (!script) {
        script = document.createElement('script');
        script.id = 'dynamic-json-ld';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.innerHTML = JSON.stringify(jsonLd);
    }

    return () => {
      document.title = window.__DEFAULT_TITLE__ || window.__COMPANY_NAME__ || 'Velmoras Creation';
      const script = document.querySelector('script#dynamic-json-ld');
      if (script) {
        script.remove();
      }
    };
  }, [title, description, keywords, image, url, type, noindex, jsonLd]);

  return null;
};

export default Seo;
