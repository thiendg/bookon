// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // Try to get session from localStorage
            const storedSessionId = localStorage.getItem('session_id');

            if (storedSessionId) {
                const response = await fetch('/api/validate-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': storedSessionId
                    }
                });

                const data = await response.json();

                if (data.success) {
                    setUser(data.user);
                    setSessionId(storedSessionId);
                } else {
                    localStorage.removeItem('session_id');
                }
            } else {
                // Try persistent login (remember me cookie)
                const response = await fetch('/api/check-persistent-login', {
                    method: 'POST',
                    credentials: 'include' // Important for cookies
                });

                const data = await response.json();

                if (data.success) {
                    setUser(data.user);
                    setSessionId(data.session_id);
                    localStorage.setItem('session_id', data.session_id);
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, username, password) => {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, username, password })
            });

            return await response.json();
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const login = async (email, password, rememberMe = false) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Important for cookies
                body: JSON.stringify({ email, password, remember_me: rememberMe })
            });

            const data = await response.json();

            if (data.success) {
                setUser(data.user);
                setSessionId(data.session_id);
                localStorage.setItem('session_id', data.session_id);
            }

            return data;
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = async (allDevices = false) => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionId
                },
                credentials: 'include',
                body: JSON.stringify({ all_devices: allDevices })
            });

            const data = await response.json();

            if (data.success) {
                setUser(null);
                setSessionId(null);
                localStorage.removeItem('session_id');
            }

            return data;
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const verifyEmail = async (token) => {
        try {
            const response = await fetch('/api/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });

            return await response.json();
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const requestPasswordReset = async (email) => {
        try {
            const response = await fetch('/api/request-password-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            return await response.json();
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const resetPassword = async (token, newPassword) => {
        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, new_password: newPassword })
            });

            return await response.json();
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const value = {
        user,
        sessionId,
        loading,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        verifyEmail,
        requestPasswordReset,
        resetPassword
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;