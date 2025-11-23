import axiosInstance from '../config/axios';

const api = axiosInstance;

export const authAPI = {
    login: (credentials) => api.post('/restful/usuarios/login', credentials),
};

export const usuariosAPI = {
    getAll: () => api.get('/restful/usuarios'),
    getById: (id) => api.get(`/restful/usuarios/${id}`),
    create: (data) => api.post('/restful/usuarios', data),
    update: (id, data) => api.put(`/restful/usuarios/${id}`, data),
    delete: (id) => api.delete(`/restful/usuarios/${id}`),
};

export const perfilesAPI = {
    getAll: () => api.get('/perfiles'),
    getById: (id) => api.get(`/perfiles/${id}`),
    create: (data) => api.post('/perfiles', data),
    update: (id, data) => api.put(`/perfiles/${id}`, data),
    delete: (id) => api.delete(`/perfiles/${id}`),
};

export const modulosAPI = {
    getAll: () => api.get('/modulos'),
    getById: (id) => api.get(`/modulos/${id}`),
    create: (data) => api.post('/modulos', data),
    update: (id, data) => api.put(`/modulos/${id}`, data),
    delete: (id) => api.delete(`/modulos/${id}`),
};

export const accesosAPI = {
    getAll: () => api.get('/accesos'),
    getById: (id) => api.get(`/accesos/${id}`),
    create: (data) => api.post('/accesos', data),
    update: (id, data) => api.put(`/accesos/${id}`, data),
    delete: (id) => api.delete(`/accesos/${id}`),
};
