import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackApi } from '../api';

// Anonymous, privacy-light visitor + session ids kept in the browser.
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function getVisitorId() {
  let id = localStorage.getItem('ecom_visitor');
  if (!id) {
    id = uid();
    localStorage.setItem('ecom_visitor', id);
  }
  return id;
}

function getSessionId() {
  let id = sessionStorage.getItem('ecom_session');
  if (!id) {
    id = uid();
    sessionStorage.setItem('ecom_session', id);
  }
  return id;
}

// Fires one page-view beacon per route change on the public storefront.
// Admin panel views are ignored so they don't pollute traffic numbers.
export default function useTracker() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/admin')) return;

    trackApi
      .hit({
        path,
        visitor_id: getVisitorId(),
        session_id: getSessionId(),
        referrer: document.referrer || null,
      })
      .catch(() => {
        /* tracking must never break the app */
      });
  }, [location.pathname]);
}
