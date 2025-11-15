// src/services/auth.service.js
import axiosInstance from './axiosInstance';
import { API_CONFIG } from '@/config/api.config';

export const authService = {
    /**
     * Register new user
     * @param {Object} userData - {email, name, password}
     */
    register: async (userData) => {
        return await axiosInstance.post(API_CONFIG.ENDPOINTS.REGISTER, userData);
    },

    /**
     * Verify email with token
     * @param {string} token - Verification token from email
     */
    verifyEmail: async (token) => {
        return await axiosInstance.get(`${API_CONFIG.ENDPOINTS.VERIFY_EMAIL}?token=${token}`);
    },

    /**
     * Login user
     * @param {string} email 
     * @param {string} password 
     * @param {boolean} rememberMe - Enable persistent login
     */
    login: async (email, password, rememberMe = false) => {
        return await axiosInstance.post(API_CONFIG.ENDPOINTS.LOGIN, {
            email,
            password,
            remember_me: rememberMe
        });
    },

    /**
     * Logout user
     */
    logout: async () => {
        return await axiosInstance.post(API_CONFIG.ENDPOINTS.LOGOUT);
    },

    /**
     * Check authentication status
     * Verifies session or persistent login cookie
     */
    checkAuth: async () => {
        return await axiosInstance.get(API_CONFIG.ENDPOINTS.CHECK_AUTH);
    },

    /**
     * Request password reset email
     * @param {string} email 
     */
    forgotPassword: async (email) => {
        return await axiosInstance.post(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD, { email });
    },

    /**
     * Reset password with token
     * @param {string} token - Reset token from email
     * @param {string} password - New password
     */
    resetPassword: async (token, password) => {
        return await axiosInstance.post(API_CONFIG.ENDPOINTS.RESET_PASSWORD, {
            token,
            password
        });
    }
};