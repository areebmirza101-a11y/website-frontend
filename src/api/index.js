import { apiFetch } from './client';

export const authApi = {
  login: (email, password) =>
    apiFetch('/auth/login', { method: 'POST', body: { email, password }, skipErrorRedirect: true }),
  register: (name, email, password) =>
    apiFetch('/auth/register', { method: 'POST', body: { name, email, password }, skipErrorRedirect: true }),
  me: () => apiFetch('/auth/me', { auth: true, skipErrorRedirect: true }),
  changePassword: (current_password, new_password) =>
    apiFetch('/auth/change-password', { method: 'POST', body: { current_password, new_password }, auth: true, skipErrorRedirect: true }),
};

export const productApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
    ).toString();
    return apiFetch(`/products${qs ? `?${qs}` : ''}`);
  },
  get: (idOrSlug) => apiFetch(`/products/${idOrSlug}`),
  create: (body) => apiFetch('/products', { method: 'POST', body, auth: true }),
  update: (id, body) => apiFetch(`/products/${id}`, { method: 'PUT', body, auth: true }),
  remove: (id) => apiFetch(`/products/${id}`, { method: 'DELETE', auth: true }),
  uploadMainImage: (id, file) => {
    const fd = new FormData();
    fd.append('main_image', file);
    return apiFetch(`/products/${id}/main-image`, { method: 'POST', body: fd, auth: true });
  },
  uploadDetailImages: (id, files) => {
    const fd = new FormData();
    [...files].forEach((f) => fd.append('detail_images', f));
    return apiFetch(`/products/${id}/detail-images`, { method: 'POST', body: fd, auth: true });
  },
  setMainImage: (imageId) => apiFetch(`/products/images/${imageId}/main`, { method: 'PUT', auth: true }),
  updateImagePrice: (imageId, price) => apiFetch(`/products/images/${imageId}/price`, { method: 'PUT', body: { price }, auth: true }),
  removeImage: (imageId) => apiFetch(`/products/images/${imageId}`, { method: 'DELETE', auth: true }),
};

export const categoryApi = {
  list: () => apiFetch('/categories'),
  listWithSubs: () => apiFetch('/categories/with-subs'),
  getSubcategories: (id) => apiFetch(`/categories/${id}/subcategories`),
  create: (body) => apiFetch('/categories', { method: 'POST', body, auth: true }),
  update: (id, body) => apiFetch(`/categories/${id}`, { method: 'PUT', body, auth: true }),
  remove: (id) => apiFetch(`/categories/${id}`, { method: 'DELETE', auth: true }),
};

export const orderApi = {
  checkout: (payload) => apiFetch('/orders/checkout', { method: 'POST', body: payload, auth: true }),
  listAll: () => apiFetch('/orders', { auth: true }),
  get: (id) => apiFetch(`/orders/${id}`, { auth: true }),
  updateStatus: (id, body) => apiFetch(`/orders/${id}/status`, { method: 'PATCH', body, auth: true }),
};

export const adminApi = {
  stats: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
    ).toString();
    return apiFetch(`/admin/stats${qs ? `?${qs}` : ''}`, { auth: true });
  },
  customers: () => apiFetch('/admin/customers', { auth: true }),
  customer: (id) => apiFetch(`/admin/customers/${id}`, { auth: true }),
  deleteCustomer: (id) => apiFetch(`/admin/customers/${id}`, { method: 'DELETE', auth: true }),
};

export const trackApi = {
  hit: (payload) => apiFetch('/track', { method: 'POST', body: payload, skipErrorRedirect: true }),
};

export const settingsApi = {
  get: () => apiFetch('/settings', { auth: true, skipErrorRedirect: true }),
  getPublic: () => apiFetch('/settings/public', { skipErrorRedirect: true }),
  update: (body) => apiFetch('/settings', { method: 'PUT', body, auth: true, skipErrorRedirect: true }),
};

export const contactApi = {
  create: (body) => apiFetch('/contact', { method: 'POST', body }),
  list: () => apiFetch('/contact', { auth: true }),
  markRead: (id) => apiFetch(`/contact/${id}/read`, { method: 'PATCH', auth: true }),
};

export const chatApi = {
  send: (body) => apiFetch('/chat', { method: 'POST', body, skipErrorRedirect: true }),
};

export const sizeGuideApi = {
  getPublic: () => apiFetch('/size-guides/public', { skipErrorRedirect: true }),
};

export const adminSizeGuideApi = {
  list: () => apiFetch('/admin/size-guides', { auth: true }),
  create: (body) => apiFetch('/admin/size-guides', { method: 'POST', body, auth: true }),
  update: (id, body) => apiFetch(`/admin/size-guides/${id}`, { method: 'PUT', body, auth: true }),
  remove: (id) => apiFetch(`/admin/size-guides/${id}`, { method: 'DELETE', auth: true }),
};
