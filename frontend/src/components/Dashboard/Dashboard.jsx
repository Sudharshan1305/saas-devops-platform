import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { billingAPI, usageAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const { user } = useSelector((state) => state.auth);
    const [subscription, setSubscription] = useState(null);
    const [usage, setUsage] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [subResponse, usageResponse] = await Promise.all([
                billingAPI.getMySubscription(),
                usageAPI.getLimits(),
            ]);

            setSubscription(subResponse.data.data);
            setUsage(usageResponse.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Dashboard</h1>

            <div style={styles.welcome}>
                <h2>Welcome, {user?.name}! 👋</h2>
                <p>Email: {user?.email}</p>
                <p>Role: {user?.role}</p>
            </div>

            <div style={styles.grid}>
                {/* Subscription Card */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Your Subscription</h3>
                    {subscription ? (
                        <>
                            <p style={styles.planName}>{subscription.planId?.displayName || 'No Plan'}</p>
                            <p style={styles.planPrice}>
                                ${subscription.planId?.price || 0}/{subscription.planId?.interval || 'month'}
                            </p>
                            <p style={styles.status}>Status: {subscription.status}</p>
                            <button
                                onClick={() => navigate('/billing')}
                                style={styles.button}
                            >
                                Manage Subscription
                            </button>
                        </>
                    ) : (
                        <p>No active subscription</p>
                    )}
                </div>

                {/* Usage Card */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>API Usage</h3>
                    {usage && (
                        <>
                            <div style={styles.progressContainer}>
                                <div
                                    style={{
                                        ...styles.progressBar,
                                        width: `${usage.percentage}%`,
                                        backgroundColor: usage.percentage > 80 ? '#dc3545' : '#28a745',
                                    }}
                                />
                            </div>
                            <p style={styles.usageText}>
                                {usage.current} / {usage.limit} calls
                            </p>
                            <p style={styles.remainingText}>
                                {usage.remaining} calls remaining ({usage.percentage}% used)
                            </p>
                            <button
                                onClick={() => navigate('/usage')}
                                style={styles.button}
                            >
                                View Details
                            </button>
                        </>
                    )}
                </div>
            </div>

            {user?.role === 'ADMIN' && (
                <div style={styles.adminSection}>
                    <h3>Admin Access</h3>
                    <button
                        onClick={() => navigate('/admin')}
                        style={styles.adminButton}
                    >
                        Go to Admin Dashboard
                    </button>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    loading: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '18px',
    },
    title: {
        marginBottom: '30px',
    },
    welcome: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
    },
    card: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    cardTitle: {
        marginBottom: '15px',
        color: '#333',
    },
    planName: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    planPrice: {
        fontSize: '18px',
        color: '#666',
        marginBottom: '10px',
    },
    status: {
        textTransform: 'capitalize',
        marginBottom: '15px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    progressContainer: {
        width: '100%',
        height: '20px',
        backgroundColor: '#e9ecef',
        borderRadius: '10px',
        overflow: 'hidden',
        marginBottom: '10px',
    },
    progressBar: {
        height: '100%',
        transition: 'width 0.3s ease',
    },
    usageText: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    remainingText: {
        color: '#666',
        marginBottom: '15px',
    },
    adminSection: {
        backgroundColor: '#fff3cd',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
    },
    adminButton: {
        padding: '12px 30px',
        backgroundColor: '#ffc107',
        color: '#000',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '10px',
    },
};

export default Dashboard;