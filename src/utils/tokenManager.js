// @/utils/tokenManager.js

const TOKEN_KEY = 'access_token';
const SESSION_KEY = 'session_token';
const REFRESH_KEY = 'refresh_token';
const USER_KEY = 'user';

export const tokenManager = {
    // Access Token
    setAccessToken: (token) => {
        localStorage.setItem(TOKEN_KEY, token);
    },

    getAccessToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    removeAccessToken: () => {
        localStorage.removeItem(TOKEN_KEY);
    },

    // Session Token
    setSessionToken: (token) => {
        localStorage.setItem(SESSION_KEY, token);
    },

    getSessionToken: () => {
        return localStorage.getItem(SESSION_KEY);
    },

    removeSessionToken: () => {
        localStorage.removeItem(SESSION_KEY);
    },

    // Refresh Token
    setRefreshToken: (token) => {
        localStorage.setItem(REFRESH_KEY, token);
    },

    getRefreshToken: () => {
        return localStorage.getItem(REFRESH_KEY);
    },

    removeRefreshToken: () => {
        localStorage.removeItem(REFRESH_KEY);
    },

    // User Data
    setUser: (user) => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    getUser: () => {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    removeUser: () => {
        localStorage.removeItem(USER_KEY);
    },

    // Clear All
    clearAll: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem(USER_KEY);
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!tokenManager.getAccessToken();
    }
};