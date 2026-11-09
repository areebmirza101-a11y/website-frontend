import { createContext, useContext, useState, useEffect } from 'react';

const TRANSLATIONS = {
  en: {
    'nav.home': 'Home',
    'nav.costumes': 'Custom Costumes',
    'nav.all': 'All Products',
    'nav.sizeGuide': 'Size Guide',
    'nav.contact': 'Contact Us',
    'nav.track': 'Track Order',
    'nav.search': 'Search costumes...',
    'product.sale': 'SALE',
    'product.soldOut': 'Sold Out',
    'product.addToCart': 'Add to Cart',
    'product.viewDetails': 'View Details',
    'product.inStock': 'In Stock',
    'cart.title': 'Shopping Cart',
    'cart.checkout': 'Checkout',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.shippingCalculated': 'Calculated at checkout',
    'cart.promo': 'Have a Promo Code?',
    'cart.apply': 'Apply',
    'cart.total': 'Total',
    'cart.empty': 'Your cart is empty',
    'common.currency': 'Currency',
    'common.language': 'Language',
  },
  ur: {
    'nav.home': 'ہوم',
    'nav.costumes': 'کسٹم ملبوسات',
    'nav.all': 'تمام مصنوعات',
    'nav.sizeGuide': 'سائز گائیڈ',
    'nav.contact': 'رابطہ کریں',
    'nav.track': 'آرڈر ٹریک کریں',
    'nav.search': 'ملبوسات تلاش کریں...',
    'product.sale': 'سیل',
    'product.soldOut': 'ختم ہو گیا',
    'product.addToCart': 'ٹوکری میں شامل کریں',
    'product.viewDetails': 'تفصیلات دیکھیں',
    'product.inStock': 'دستیاب ہے',
    'cart.title': 'خریداری کی ٹوکری',
    'cart.checkout': 'چیک آؤٹ',
    'cart.subtotal': 'ذیلی کل',
    'cart.shipping': 'ڈلیوری چارجز',
    'cart.shippingCalculated': 'چیک آؤٹ پر حساب کیا جائے گا',
    'cart.promo': 'کیا پرومو کوڈ ہے؟',
    'cart.apply': 'لاگو کریں',
    'cart.total': 'کل رقم',
    'cart.empty': 'آپ کی ٹوکری خالی ہے',
    'common.currency': 'کرنسی',
    'common.language': 'زبان',
  },
};

const LANG_STORAGE_KEY = 'velmoras_selected_language';

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key, fallback) => fallback || key,
  languages: [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  ],
});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved && (saved === 'en' || saved === 'ur')) return saved;
    } catch (e) {}
    return 'en';
  });

  const setLanguage = (code) => {
    if (code === 'en' || code === 'ur') {
      setLanguageState(code);
      try {
        localStorage.setItem(LANG_STORAGE_KEY, code);
      } catch (e) {}
    }
  };

  const t = (key, fallback) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: [
          { code: 'en', name: 'English', flag: '🇺🇸' },
          { code: 'ur', name: 'اردو', flag: '🇵🇰' },
        ],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

