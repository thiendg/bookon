// src/services/axiosInstance.js
import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';

const axiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    withCredentials: true, // CRITICAL: Automatically sends cookies (session + remember_me)
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Response interceptor - only unwrap data
axiosInstance.interceptors.response.use(
    (response) => response.data, // Return only data for cleaner usage
    (error) => {
        // Pass error to component for handling
        return Promise.reject(error.response?.data || error);
    }
);

export default axiosInstance;