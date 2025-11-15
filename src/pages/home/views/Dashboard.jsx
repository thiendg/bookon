// src/pages/home/views/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import axiosInstance from '@/services/axiosInstance';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Only fetch users if you have the backend endpoint ready
        // For now, we'll just show the current user
        setLoading(false);

        // Uncomment this when you create the users API endpoint
        fetchUsers();
    }, []);

    // Uncomment this when you create /modules/users/api/read.php in backend
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await axiosInstance.get('/modules/users/api/read.php');

            if (data.success) {
                setUsers(data.data);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
            // Still navigate to login even if logout API fails
            navigate('/login');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* User Info Card */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                padding: '20px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <div>
                    <h2 style={{ margin: '0 0 10px 0' }}>Welcome, {user?.name}!</h2>
                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>{user?.email}</p>
                    <p style={{
                        margin: 0,
                        fontSize: '14px',
                        color: user?.email_verified_at ? '#2e7d32' : '#f57c00'
                    }}>
                        {user?.email_verified_at ? '✓ Email Verified' : '⚠ Email Not Verified'}
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                >
                    Logout
                </button>
            </div>

            {/* User Stats/Info */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
            }}>
                <div style={{
                    padding: '20px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e0e0e0'
                }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>User ID</h4>
                    <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>#{user?.id}</p>
                </div>

                <div style={{
                    padding: '20px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e0e0e0'
                }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Member Since</h4>
                    <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                        {user?.created_at ? new Date(user.created_at * 1000).toLocaleDateString() : 'N/A'}
                    </p>
                </div>

                <div style={{
                    padding: '20px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e0e0e0'
                }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Account Status</h4>
                    <p style={{
                        margin: 0,
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#2e7d32'
                    }}>
                        Active
                    </p>
                </div>
            </div>

            {/* Content Area */}
            <div style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ marginTop: 0 }}>Dashboard</h3>
                <p style={{ color: '#666' }}>
                    Welcome to your BookOn dashboard! This is a protected route that only authenticated users can access.
                </p>

                {/* Users List (Optional - when backend is ready) */}
                {users.length > 0 ? (
                    <>
                        <h4>Users List</h4>
                        {loading && <div>Loading users...</div>}

                        {error && (
                            <div style={{
                                padding: '10px',
                                backgroundColor: '#ffebee',
                                color: '#c62828',
                                borderRadius: '4px',
                                marginBottom: '20px'
                            }}>
                                {error}
                            </div>
                        )}

                        {!loading && !error && (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{
                                    width: '100%',
                                    borderCollapse: 'collapse',
                                    marginTop: '20px'
                                }}>
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
                                        {users.map((u) => (
                                            <tr key={u.id} style={{ borderBottom: '1px solid #ddd' }}>
                                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{u.id}</td>
                                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{u.name}</td>
                                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{u.email}</td>
                                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                                    <span style={{
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        backgroundColor: u.email_verified_at ? '#e8f5e9' : '#ffebee',
                                                        color: u.email_verified_at ? '#2e7d32' : '#c62828',
                                                        fontSize: '14px'
                                                    }}>
                                                        {u.email_verified_at ? '✓ Verified' : '✗ Not Verified'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                                    {new Date(u.created_at * 1000).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{
                        padding: '40px',
                        textAlign: 'center',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                        marginTop: '20px'
                    }}>
                        <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>
                            📚 Your bookstore dashboard content will appear here
                        </p>
                        <p style={{ margin: '10px 0 0 0', color: '#999', fontSize: '14px' }}>
                            Start by creating book management APIs in your backend
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;