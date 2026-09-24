import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { setGlobalNavigate } from './api/client';
import useTracker from './hooks/useTracker';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import ScrollToTop from './components/ScrollToTop';

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SalesProvider } from './context/SalesContext';

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
      <Toaster position="bottom-right" toastOptions={{ className: 'font-sans font-medium', duration: 3000 }} />
      <Routes>
        <Route path="/admin/*" element={<AuthProvider key="admin"><AdminRoutes /></AuthProvider>} />
        <Route path="/*" element={<AuthProvider key="user"><SalesProvider><UserRoutes /></SalesProvider></AuthProvider>} />
      </Routes>
    </>
  );
}

export default App;
