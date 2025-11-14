// @/config/api.config.js

export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost/api',
    TIMEOUT: 10000,
    ENDPOINTS: {
        // Auth endpoints
        REGISTER: '/auth/register.php',
        LOGIN: '/auth/login.php',
        LOGOUT: '/auth/logout.php',
        VERIFY_EMAIL: '/auth/verify-email.php',
        FORGOT_PASSWORD: '/auth/forgot-password.php',
        RESET_PASSWORD: '/auth/reset-password.php',
        CURRENT_USER: '/auth/me.php',
        REFRESH_TOKEN: '/auth/refresh-token.php',
        CHECK_PERSISTENT: '/auth/check-persistent-login.php'
    }
};

/**
 * Base fetch wrapper with error handling
 */
export const apiFetch = async (endpoint, options = {}) => {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;

    const config = {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        credentials: 'include', // Important for cookies
        ...options
    };

    // Add body if present
    if (options.body) {
        config.body = JSON.stringify(options.body);
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        const response = await fetch(url, {
            ...config,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Parse response
        const data = await response.json();

        // Check if response is ok
        if (!response.ok) {
            throw {
                status: response.status,
                message: data.message || 'Request failed',
                data: data
            };
        }

        return data;
    } catch (error) {
        // Handle different error types
        if (error.name === 'AbortError') {
            throw { message: 'Request timeout', status: 408 };
        }

        if (error.status) {
            // API error
            throw error;
        }

        // Network or other errors
        throw {
            message: error.message || 'Network error',
            status: 0
        };
    }
};