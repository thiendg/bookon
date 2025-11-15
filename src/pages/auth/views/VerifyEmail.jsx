// src/pages/auth/views/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');
    const { verifyEmail } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link');
            return;
        }

        const verify = async () => {
            try {
                const result = await verifyEmail(token);

                if (result.success) {
                    setStatus('success');
                    setMessage('Email verified successfully! Redirecting to login...');
                    setTimeout(() => navigate('/login'), 2000);
                } else {
                    setStatus('error');
                    setMessage(result.message || 'Verification failed');
                }
            } catch (err) {
                setStatus('error');
                setMessage(err.message || 'An error occurred');
            }
        };

        verify();
    }, [searchParams, verifyEmail, navigate]);

    return (
        <div className="verify-email-container">
            <h2>Email Verification</h2>
            {status === 'verifying' && <p>Verifying your email...</p>}
            {status === 'success' && <p className="success">{message}</p>}
            {status === 'error' && <p className="error">{message}</p>}
        </div>
    );
};

export default VerifyEmail;