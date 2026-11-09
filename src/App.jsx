import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { setGlobalNavigate } from './api/client';
import useTracker from './hooks/useTracker';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import ScrollToTop from './components/ScrollToTop';

import { Toaster, ToastBar } from 'react-hot-toast';
import { ConfirmModalRoot } from './utils/confirmToast';
import { AuthProvider } from './context/AuthContext';
import { SalesProvider } from './context/SalesContext';
import { SettingsProvider } from './context/SettingsContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    setGlobalNavigate(navigate);
  }, [navigate]);

  useEffect(() => {
    import('./api').then(({ settingsApi }) => {
      settingsApi.getPublic().then(s => {
        if (s?.company_name) {
          window.__COMPANY_NAME__ = s.company_name;
          const title = s.tagline ? `${s.company_name} — ${s.tagline}` : s.company_name;
          document.title = title;
          window.__DEFAULT_TITLE__ = title;
        }
        if (s?.app_favicon) {
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = s.app_favicon;
        }
      }).catch(() => {});
    });
  }, []);

  useTracker();

  return (
    <>
      <ScrollToTop />
      <ConfirmModalRoot />
      <Toaster
        position="top-right"
        containerStyle={{ top: 90, zIndex: 999999 }}
        toastOptions={{
          duration: 3500,
          className: 'font-sans font-semibold text-sm',
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            borderRadius: '16px',
            padding: '14px 20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      >
        {(t) => (
          <ToastBar
            toast={t}
            style={{
              ...t.style,
              position: 'relative',
              overflow: 'hidden',
              paddingBottom: t.duration && t.duration !== Infinity ? '16px' : undefined,
            }}
          >
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== 'loading' && t.duration && t.duration !== Infinity && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      height: '3.5px',
                      borderRadius: '0 0 16px 16px',
                      background:
                        t.type === 'error'
                          ? 'linear-gradient(90deg, #ef4444, #f87171)'
                          : t.type === 'success'
                          ? 'linear-gradient(90deg, #10b981, #34d399)'
                          : 'linear-gradient(90deg, #BA9B74, #e2cba8)',
                      animation: `toast-progress ${t.duration || 3500}ms linear forwards`,
                    }}
                  />
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
      <SettingsProvider>
      <CurrencyProvider>
      <LanguageProvider>
      <Routes>
        <Route path="/admin/*" element={<AuthProvider key="admin"><AdminRoutes /></AuthProvider>} />
        <Route path="/*" element={<AuthProvider key="user"><SalesProvider><UserRoutes /></SalesProvider></AuthProvider>} />
      </Routes>
      </LanguageProvider>
      </CurrencyProvider>
      </SettingsProvider>
    </>
  );
}

export default App;
