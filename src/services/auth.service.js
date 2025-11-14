import api from './axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // Important for cookies
});

// Request interceptor - Add session token
api.interceptors.request.use(
    (config) => {
        const sessionId = localStorage.getItem('session_id');
        if (sessionId) {
            config.headers.Authorization = sessionId;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle session expiry
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retried, try persistent login
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to restore session from persistent login cookie
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/auth/check-persistent-login.php`,
                    {},
                    { withCredentials: true }
                );

                if (response.data.success) {
                    const newSessionId = response.data.session_id;
                    localStorage.setItem('session_id', newSessionId);

                    // Retry original request with new session
                    originalRequest.headers.Authorization = newSessionId;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Persistent login failed, clear and redirect
                localStorage.removeItem('session_id');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

export const authService = {
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register.php', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    verifyEmail: async (token) => {
        try {
            const response = await api.post('/auth/verify-email.php', { token });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login.php', credentials);

            if (response.data.success) {
                const { session_id, user } = response.data;
                localStorage.setItem('session_id', session_id);
                localStorage.setItem('user', JSON.stringify(user));
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    logout: async (allDevices = false) => {
        try {
            await api.post('/auth/logout.php', { all_devices: allDevices });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('session_id');
            localStorage.removeItem('user');
        }
    },

    forgotPassword: async (email) => {
        try {
            const response = await api.post('/auth/forgot-password.php', { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    resetPassword: async (token, newPassword) => {
        try {
            const response = await api.post('/auth/reset-password.php', {
                token,
                new_password: newPassword
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getCurrentUser: async () => {
        try {
            const response = await api.get('/auth/me.php');
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.data));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    checkPersistentLogin: async () => {
        try {
            const response = await api.post('/auth/check-persistent-login.php');
            if (response.data.success) {
                localStorage.setItem('session_id', response.data.session_id);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};