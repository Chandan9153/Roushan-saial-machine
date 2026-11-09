import axios from 'axios';

// All data comes from the real Express backend. There are no fake API responses.
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('roushan_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const SHOP = {
  name: 'Roushan Sewing Machine & Electronics',
  hindiName: 'रोशन सिलाई मशीन एंड इलेक्ट्रॉनिक',
  address: 'Itkhori Chowk, Itkhori, Chatra, Jharkhand 825408, India',
  phoneDisplay: '+91 87977 77269',
  phone: '918797777269',
  instagram: 'roushan_sewing_machine',
  googleRating: '5.0',
  googleReviews: 9,
};

export function whatsappUrl(message) {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || SHOP.phone;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function formatPrice(price) {
  if (price == null) return 'Price on enquiry';
  return `₹${Number(price).toLocaleString('en-IN')}`;
}

export function imageUrl(image) {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
  return `${base}${image}`;
}

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};
export const productApi = {
  list: (params) => api.get('/products', { params }),
  get: (id) => api.get(`/products/${id}`),
  related: (id) => api.get(`/products/${id}/related`),
  create: (formData) => api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id) => api.delete(`/products/${id}`),
};
export const categoryApi = {
  list: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  remove: (id) => api.delete(`/categories/${id}`),
};
export const orderApi = {
  create: (data) => api.post('/orders', data),
  myOrders: () => api.get('/orders/my-orders'),
  get: (id) => api.get(`/orders/${id}`),
};
export const adminApi = {
  dashboard: () => api.get('/admin/dashboard'),
  orders: (status) => api.get('/admin/orders', { params: status ? { status } : {} }),
  updateOrderStatus: (id, orderStatus) => api.put(`/admin/orders/${id}/status`, { orderStatus }),
  customers: () => api.get('/admin/customers'),
};

export default api;
