import api from './api';

export const authService = {
    login: async (username, password) => {
        const response = await api.post('/api/auth/login', { username, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    register: async (username, email, password) => {
        const response = await api.post('/api/auth/register', { username, email, password });
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getCurrentUser: async () => {
        const response = await api.get('/api/user/profile');
        return response.data;
    },

    // ✅ NEW — uses SAME endpoint, correct HTTP verb
    updateProfile: async (updatedUser) => {
        const response = await api.put('/api/user/profile', updatedUser);
        return response.data;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
};
