// src/services/users.service.js
// Create this when you're ready to implement users management in backend

import axiosInstance from './axiosInstance';

export const usersService = {
    /**
     * Get all users
     */
    getAll: async () => {
        return await axiosInstance.get('/modules/users/api/read.php');
    },

    /**
     * Get single user by ID
     */
    getById: async (id) => {
        return await axiosInstance.get(`/modules/users/api/read_single.php?id=${id}`);
    },

    /**
     * Create new user (admin only)
     */
    create: async (userData) => {
        return await axiosInstance.post('/modules/users/api/create.php', userData);
    },

    /**
     * Update user
     */
    update: async (id, userData) => {
        return await axiosInstance.put('/modules/users/api/update.php', {
            id,
            ...userData
        });
    },

    /**
     * Delete user
     */
    delete: async (id) => {
        return await axiosInstance.delete('/modules/users/api/delete.php', {
            data: { id }
        });
    }
};