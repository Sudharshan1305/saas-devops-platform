import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';

function AdminDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await adminAPI.getDashboard();
            setDashboard(response.data.data);
        } catch (error) {
            console.error('Error fetching admin dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading admin dashboard...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>🔧 Admin Dashboard</h1>

            {/* System Health */}
            <div style={styles.card}>
                <h2 style={styles.cardTitle}>System Health</h2>

                <div style={styles.healthOverall}>
                    <span>Overall Status: </span>
                    <span style={{
                        ...styles.healthBadge,
                        backgroundColor: dashboard.systemHealth.overall === 'healthy' ? '#28a745' : '#ffc107',
                    }}>
                        {dashboard.systemHealth.overall.toUpperCase()}
                    </span>
                </div>

                <div style={styles.servicesGrid}>
                    {dashboard.systemHealth.services.map((service, index) => (
                        <div key={index} style={styles.serviceCard}>
                            <h3 style={styles.serviceName}>{service.service}</h3>
                            <p style={styles.serviceStatus}>
                                Status: <span style={{
                                    color: service.status === 'healthy' ? '#28a745' : '#dc3545',
                                    fontWeight: 'bold',
                                }}>
                                    {service.status}
                                </span>
                            </p>
                            {service.responseTime && (
                                <p style={styles.responseTime}>Response: {service.responseTime}</p>
                            )}
                            {service.error && (
                                <p style={styles.error}>Error: {service.error}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Revenue Analytics */}
            <div style={styles.card}>
                <h2 style={styles.cardTitle}>Revenue Analytics</h2>

                <div style={styles.revenueStats}>
                    <div style={styles.revenueItem}>
                        <h3>Total Plans</h3>
                        <p style={styles.revenueValue}>{dashboard.revenue.totalPlans}</p>
                    </div>
                    <div style={styles.revenueItem}>
                        <h3>Estimated MRR</h3>
                        <p style={styles.revenueValue}>${dashboard.revenue.estimatedMRR}</p>
                    </div>
                </div>

                <h3 style={styles.plansTitle}>Available Plans</h3>
                <div style={styles.plansGrid}>
                    {dashboard.revenue.plans.map((plan, index) => (
                        <div key={index} style={styles.planCard}>
                            <h4>{plan.displayName}</h4>
                            <p style={styles.planPrice}>${plan.price}/{plan.currency}</p>
                            <p style={styles.planFeature}>
                                API Calls: {plan.features.apiCallsLimit.toLocaleString()}
                            </p>
                            <p style={styles.planFeature}>
                                Storage: {plan.features.storageLimit} GB
                            </p>
                        </div>
                    ))}
                </div>
            </div>
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
        color: '#333',
    },
    card: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        marginBottom: '25px',
    },
    cardTitle: {
        marginBottom: '20px',
        borderBottom: '2px solid #007bff',
        paddingBottom: '10px',
    },
    healthOverall: {
        fontSize: '18px',
        marginBottom: '20px',
    },
    healthBadge: {
        padding: '5px 15px',
        borderRadius: '20px',
        color: 'white',
        fontWeight: 'bold',
        marginLeft: '10px',
    },
    servicesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '15px',
    },
    serviceCard: {
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        border: '1px solid #dee2e6',
    },
    serviceName: {
        fontSize: '16px',
        marginBottom: '10px',
    },
    serviceStatus: {
        marginBottom: '5px',
    },
    responseTime: {
        fontSize: '14px',
        color: '#666',
    },
    error: {
        color: '#dc3545',
        fontSize: '14px',
    },
    revenueStats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
    },
    revenueItem: {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#e7f3ff',
        borderRadius: '8px',
    },
    revenueValue: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#007bff',
        marginTop: '10px',
    },
    plansTitle: {
        marginTop: '30px',
        marginBottom: '15px',
    },
    plansGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
    },
    planCard: {
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        textAlign: 'center',
    },
    planPrice: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#28a745',
        margin: '10px 0',
    },
    planFeature: {
        fontSize: '14px',
        color: '#666',
        marginTop: '5px',
    },
};

export default AdminDashboard;