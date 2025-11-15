// src/config/api.config.js
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost/bookon/bookon-be/',
    TIMEOUT: 10000,
    ENDPOINTS: {
        // Auth endpoints - matching backend structure
        REGISTER: '/modules/auth/api/register.php',
        VERIFY_EMAIL: '/modules/auth/api/verify-email.php',
        LOGIN: '/modules/auth/api/login.php',
        LOGOUT: '/modules/auth/api/logout.php',
        CHECK_AUTH: '/modules/auth/api/check-auth.php',
        FORGOT_PASSWORD: '/modules/auth/api/forgot-password.php',
        RESET_PASSWORD: '/modules/auth/api/reset-password.php',
    }
};