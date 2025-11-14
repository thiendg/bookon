// @/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import api from '@/services/auth.service';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/read.php');

            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                padding: '20px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px'
            }}>
                <div>
                    <h2 style={{ margin: '0 0 10px 0' }}>Welcome, {user?.name}!</h2>
                    <p style={{ margin: 0, color: '#666' }}>{user?.email}</p>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>
            </div>

            <h3>Users List (Protected Route)</h3>

            {loading && <div>Loading users...</div>}

            {error && (
                <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '20px' }}>
                    {error}
                </div>
            )}

            {!loading && !error && (
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>ID</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Name</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Verified</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.id}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.name}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.email}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        backgroundColor: user.email_verified ? '#e8f5e9' : '#ffebee',
                                        color: user.email_verified ? '#2e7d32' : '#c62828'
                                    }}>
                                        {user.email_verified ? '✓ Verified' : '✗ Not Verified'}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Dashboard;