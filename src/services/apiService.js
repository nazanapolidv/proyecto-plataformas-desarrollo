import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const apiService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    verifyToken: async (token) => {
        const response = await api.get('/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getEspecializaciones: async () => {
        const response = await api.get('/especializaciones');
        return response.data;
    },

    getMedicosByEspecializacion: async (especializacionId) => {
        const response = await api.get(`/especializaciones/${especializacionId}/medicos`);
        return response.data;
    },

    getMedicos: async () => {
        const response = await api.get('/medicos');
        return response.data;
    },

    getMedico: async (id) => {
        const response = await api.get(`/medicos/${id}`);
        return response.data;
    },

    getCitas: async () => {
        const response = await api.get('/citas');
        return response.data;
    },

    createCita: async (citaData) => {
        const response = await api.post('/citas', citaData);
        return response.data;
    },

    cancelCita: async (citaId) => {
        const response = await api.put(`/citas/${citaId}/cancel`);
        return response.data;
    },

    getAllCitas: async () => {
        const response = await api.get('/citas/admin/all');
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    updateProfile: async (userData) => {
        const response = await api.put('/users/profile', userData);
        return response.data;
    },

    getHistorial: async () => {
        const response = await api.get('/historial');
        return response.data;
    }
};