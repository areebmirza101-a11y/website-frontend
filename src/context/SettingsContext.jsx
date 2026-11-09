import { createContext, useContext, useState, useEffect } from 'react';
import { settingsApi } from '../api';

const SETTINGS_STORAGE_KEY = 'velmoras_public_settings';

export const DEFAULT_SETTINGS = {
  company_name: 'Velmoras Creation',
  tagline: 'Premium Custom Made Costumes & Export',
  email: 'info@velmorascreation.com',
  phone: '+92 3166186641',
  whatsapp: '+92 3166186641',
  address: 'G-10, Islamabad, Pakistan',
  business_hours: 'Mon-Sat 9AM-6PM PKT',
  app_logo: '/logo.png',
  app_favicon: '/favicon.png',
  hero_title: 'Screen-Accurate Cosplay &\nCinema Costumes.',
  hero_subtitle: 'Handcrafted custom-made cosplay outfits, cinema replicas, armor, tunics & robes built to perfection. Worldwide express delivery.',
  cta_text: 'Explore Costumes',
  cta_link: '/products',
  hero_bg: '',
  feature_1_title: 'Master Craftsmanship',
  feature_1_desc: 'Uncompromising attention to detail in every seam, armor piece & stitch.',
  feature_2_title: 'Screen-Accurate Fabrics',
  feature_2_desc: 'Cinema-grade textiles, heavy-duty linens & genuine leathers built to last.',
  feature_3_title: 'Worldwide Express Export',
  feature_3_desc: 'Secure international shipping with live tracking to your doorstep.',
  feature_4_title: 'Bespoke Custom Fit',
  feature_4_desc: 'Tailored specifically to your unique body measurements for a cinematic look.',
  facebook: '',
  instagram: '',
  linkedin: '',
  youtube: '',
  social_links: '[]',
};

const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  loading: false,
  refreshSettings: () => {},
});

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      // Ignore localStorage parse error
    }
    return DEFAULT_SETTINGS;
  });

  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      const data = await settingsApi.getPublic();
      if (data && typeof data === 'object') {
        const merged = { ...DEFAULT_SETTINGS, ...data };
        setSettings(merged);
        try {
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
        } catch (e) {
          // Ignore quota error
        }
      }
    } catch (err) {
      console.warn('Failed to load public settings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

