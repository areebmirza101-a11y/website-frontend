import { API_BASE_URL } from '../config/api';

const TOKEN_KEY = 'ecom_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const assetUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

let globalNavigate = null;
export const setGlobalNavigate = (navigate) => {
  globalNavigate = navigate;
};

export async function apiFetch(path, { method = 'GET', body, auth = false, headers = {}, skipErrorRedirect = false } = {}) {
  const opts = { method, headers: { ...headers } };

  if (body instanceof FormData) {
    opts.body = body;
  } else if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }

  if (auth) {
    const token = getToken();
    if (token) opts.headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/api${path}`, opts);

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    let message = (data && data.message) || res.statusText || 'Request failed';
    if (data && data.details && Array.isArray(data.details)) {
      const detailsMsg = data.details.map(d => `${d.path?.join('.') || ''}: ${d.message}`).join(' | ');
      message = `${message} - ${detailsMsg}`;
    }
    const err = new Error(message);
    err.status = res.status;
    err.data = data;

    // Only redirect to login for unauthorized admin access.
    // Never force-redirect the browser URL to /500 or /404 on API errors,
    // so the customer is never trapped in error URL loops upon refresh.
    if (!skipErrorRedirect && globalNavigate && (res.status === 401 || res.status === 403)) {
      const isAdmin = window.location.pathname.startsWith('/admin');
      if (isAdmin && res.status === 401) {
        globalNavigate('/admin/login');
      }
    }

    throw err;
  }

  return data;
}
