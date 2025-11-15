// src/hooks/useAuth.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '@/services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check authentication on mount
    useEffect(() => {
        checkAuth();
    }, []);

    /**
     * Check if user is authenticated
     * Tries session first, then persistent login cookie
     */
    const checkAuth = async () => {
        try {
            const data = await authService.checkAuth();

            if (data.success && data.data.authenticated) {
                setUser(data.data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Register new user
     */
    const register = async (email, name, password) => {
        try {
            const data = await authService.register({ email, name, password });
            return data;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Login user
     */
    const login = async (email, password, rememberMe = false) => {
        try {
            const data = await authService.login(email, password, rememberMe);

            if (data.success) {
                setUser(data.data.user);
            }

            return data;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Logout user
     */
    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            // Clear user even if API call fails
            setUser(null);
        }
    };

    /**
     * Verify email with token
     */
    const verifyEmail = async (token) => {
        try {
            const data = await authService.verifyEmail(token);
            return data;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Request password reset
     */
    const forgotPassword = async (email) => {
        try {
            const data = await authService.forgotPassword(email);
            return data;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Reset password with token
     */
    const resetPassword = async (token, password) => {
        try {
            const data = await authService.resetPassword(token, password);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        verifyEmail,
        forgotPassword,
        resetPassword,
        refreshAuth: checkAuth // Manually trigger auth check if needed
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;