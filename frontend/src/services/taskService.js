import api from './api';

export const taskService = {
    getAllTasks: async (page = 0, size = 100) => {
        const response = await api.get(`/api/tasks?page=${page}&size=${size}`);
        return response.data;
    },

    getTaskById: async (id) => {
        const response = await api.get(`/api/tasks/${id}`);
        return response.data;
    },

    createTask: async (taskData) => {
        const response = await api.post('/api/tasks', taskData);
        return response.data;
    },

    updateTask: async (id, taskData) => {
        const response = await api.put(`/api/tasks/${id}`, taskData);
        return response.data;
    },

    deleteTask: async (id) => {
        await api.delete(`/api/tasks/${id}`);
    },

    searchTasks: async (query, page = 0, size = 10) => {
        const response = await api.get(`/api/tasks/search?query=${query}&page=${page}&size=${size}`);
        return response.data;
    },

    filterByPriority: async (priority, page = 0, size = 10) => {
        const response = await api.get(`/api/tasks/filter/priority/${priority}?page=${page}&size=${size}`);
        return response.data;
    },

    filterByStatus: async (status, page = 0, size = 10) => {
        const response = await api.get(`/api/tasks/filter/status/${status}?page=${page}&size=${size}`);
        return response.data;
    },

    getTasksByDate: async (date) => {
        const response = await api.get(`/api/tasks/date/${date}`);
        return response.data;
    },
};