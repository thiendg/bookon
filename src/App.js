import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import ForgotPassword from './pages/auth/views/ForgotPassword';
import Login from './pages/auth/views/Login';
import ProtectedRoute from './pages/auth/views/ProtectedRoute';
import Dashboard from './pages/home/views/Dashboard';
import Register from './pages/auth/views/Register';
import ResetPassword from './pages/auth/views/ResetPassword';
import VerifyEmail from './pages/auth/views/VerifyEmail';
import APITester from './pages/auth/components/test';


function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/api-tester" element={<APITester />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;