import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
};

export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  updatePassword: (data) => api.put('/user/password', data),
  uploadProfilePicture: (formData) =>
    api.post('/user/profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteAccount: () => api.delete('/user/account'),
  getAnalytics: () => api.get('/user/analytics'),
};

export const interviewService = {
  start: (data) => api.post('/interview/start', data),
  submitAnswer: (data) => api.post('/interview/answer', data),
  complete: (id, data) => api.post(`/interview/complete/${id}`, data),
  getHistory: (params) => api.get('/interview/history', { params }),
  getReport: (id) => api.get(`/interview/report/${id}`),
  delete: (id) => api.delete(`/interview/${id}`),
};

export const resumeService = {
  upload: (formData) =>
    api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    }),
  getHistory: () => api.get('/resume/history'),
  getReport: (id) => api.get(`/resume/report/${id}`),
  delete: (id) => api.delete(`/resume/${id}`),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  deleteUser: (id) => api.delete(`/admin/user/${id}`),
  toggleUser: (id) => api.put(`/admin/user/${id}/toggle`),
  getAllInterviews: (params) => api.get('/admin/interviews', { params }),
  exportUsers: () => api.get('/admin/export/users', { responseType: 'blob' }),
};
