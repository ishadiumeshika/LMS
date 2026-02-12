import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me')
};

// Users API
export const usersAPI = {
  getAll: (role) => api.get('/users', { params: { role } }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getStudents: () => api.get('/users/students/all'),
  getInstructors: () => api.get('/users/instructors/all')
};

// Centers API
export const centersAPI = {
  getAll: () => api.get('/centers'),
  getPublic: () => axios.get('http://localhost:5000/api/centers/public'),
  getById: (id) => api.get(`/centers/${id}`),
  create: (data) => api.post('/centers', data),
  update: (id, data) => api.put(`/centers/${id}`, data),
  delete: (id) => api.delete(`/centers/${id}`),
  assignInstructor: (centerId, instructorId) => 
    api.post(`/centers/${centerId}/instructors/${instructorId}`),
  assignStudent: (centerId, studentId) => 
    api.post(`/centers/${centerId}/students/${studentId}`)
};

// Seminars API
export const seminarsAPI = {
  getAll: () => api.get('/seminars'),
  getById: (id) => api.get(`/seminars/${id}`),
  create: (data) => api.post('/seminars', data),
  update: (id, data) => api.put(`/seminars/${id}`, data),
  delete: (id) => api.delete(`/seminars/${id}`),
  getByCenter: (centerId) => api.get(`/seminars/center/${centerId}`)
};

// Attendance API
export const attendanceAPI = {
  getAll: (params) => api.get('/attendance', { params }),
  getById: (id) => api.get(`/attendance/${id}`),
  createStudent: (data) => api.post('/attendance/student', data),
  createInstructor: (data) => api.post('/attendance/instructor', data),
  createBulk: (records) => api.post('/attendance/bulk', { records }),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  delete: (id) => api.delete(`/attendance/${id}`),
  getMyAttendance: () => api.get('/attendance/my/records')
};

export default api;
