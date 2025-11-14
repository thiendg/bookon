// @/components/VerifyEmail.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authService } from '../api/authService';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Invalid verification token');
                return;
            }

            try {
                const response = await authService.verifyEmail(token);

                if (response.success) {
                    setStatus('success');
                    setMessage('Email verified successfully!');
                } else {
                    setStatus('error');
                    setMessage(response.message || 'Verification failed');
                }
            } catch (err) {
                setStatus('error');
                setMessage(err.message || 'Verification failed');
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
            <h2>Email Verification</h2>

            {status === 'verifying' && (
                <div style={{ padding: '20px' }}>
                    <div style={{ fontSize: '18px', marginBottom: '10px' }}>Verifying your email...</div>
                    <div>Please wait...</div>
                </div>
            )}

            {status === 'success' && (
                <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>✓</div>
                    <div style={{ fontSize: '18px', color: '#2e7d32', marginBottom: '20px' }}>
                        {message}
                    </div>
                    <Link
                        to="/login"
                        style={{
                            display: 'inline-block',
                            padding: '10px 20px',
                            backgroundColor: '#1976d2',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Go to Login
                    </Link>
                </div>
            )}

            {status === 'error' && (
                <div style={{ padding: '20px', backgroundColor: '#ffebee', borderRadius: '8px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>✗</div>
                    <div style={{ fontSize: '18px', color: '#c62828', marginBottom: '20px' }}>
                        {message}
                    </div>
                    <Link
                        to="/login"
                        style={{
                            display: 'inline-block',
                            padding: '10px 20px',
                            backgroundColor: '#1976d2',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Go to Login
                    </Link>
                </div>
            )}
        </div>
    );
};

export default VerifyEmail;