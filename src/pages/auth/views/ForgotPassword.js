// @/components/ForgotPassword.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '@/services/auth.service';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await authService.forgotPassword(email);

            if (response.success) {
                setMessage('Password reset link has been sent to your email');
            }
        } catch (err) {
            setError(err.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
            <h2>Forgot Password</h2>
            <p style={{ marginBottom: '20px', color: '#666' }}>
                Enter your email address and we'll send you a link to reset your password.
            </p>

            {error && (
                <div style={{ padding: '10px', marginBottom: '20px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
                    {error}
                </div>
            )}

            {message && (
                <div style={{ padding: '10px', marginBottom: '20px', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '4px' }}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1
                    }}
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>

            <p style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link to="/login">Back to Login</Link>
            </p>
        </div>
    );
};

export default ForgotPassword;