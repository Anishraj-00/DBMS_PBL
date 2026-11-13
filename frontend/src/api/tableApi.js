import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const tableApi = {
  // Tables
  getTables: (params) => api.get('/tables', { params }).then(res => res.data),
  getTableById: (id) => api.get(`/tables/${id}`).then(res => res.data),
  createTable: (data) => api.post('/tables', data).then(res => res.data),
  updateTable: (id, data) => api.put(`/tables/${id}`, data).then(res => res.data),
  deleteTable: (id) => api.delete(`/tables/${id}`).then(res => res.data),
  updateStatus: (id, status, reason) => api.patch(`/tables/${id}/status`, { status, reason }).then(res => res.data),

  // Allocations (Check-in)
  allocateAuto: (data) => api.post('/allocations/auto', data).then(res => res.data),
  allocateManual: (data) => api.post('/allocations/manual', data).then(res => res.data),

  // Sessions (Checkout & History)
  checkoutSession: (sessionId) => api.post(`/sessions/${sessionId}/checkout`).then(res => res.data),
  checkoutByTable: (tableId) => api.post(`/sessions/tables/${tableId}/checkout`).then(res => res.data),
  getActiveSessions: () => api.get('/sessions/active').then(res => res.data),
  getAllSessions: () => api.get('/sessions').then(res => res.data),
  getRecentLogs: () => api.get('/sessions/logs').then(res => res.data),
  getTableLogs: (tableId) => api.get(`/sessions/tables/${tableId}/logs`).then(res => res.data),

  // Customers
  getCustomers: () => api.get('/customers').then(res => res.data),
  createCustomer: (data) => api.post('/customers', data).then(res => res.data),

  // Analytics & Dashboard
  getDashboardStats: () => api.get('/analytics/dashboard').then(res => res.data),
  getTableUtilization: () => api.get('/analytics/utilization').then(res => res.data),
};

