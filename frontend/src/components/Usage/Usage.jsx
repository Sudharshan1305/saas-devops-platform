import React, { useEffect, useState } from 'react';
import { usageAPI } from '../../services/api';

function Usage() {
    const [limits, setLimits] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [limitsRes, statsRes] = await Promise.all([
                usageAPI.getLimits(),
                usageAPI.getStats(),
            ]);

            setLimits(limitsRes.data.data);
            setStats(statsRes.data.data);
        } catch (error) {
            console.error('Error fetching usage data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>API Usage & Statistics</h1>

            {/* Usage Limits */}
            <div style={styles.card}>
                <h2 style={styles.cardTitle}>Current Month Usage</h2>

                {limits && (
                    <>
                        <div style={styles.progressContainer}>
                            <div
                                style={{
                                    ...styles.progressBar,
                                    width: `${limits.percentage}%`,
                                    backgroundColor:
                                        limits.percentage > 90 ? '#dc3545' :
                                            limits.percentage > 70 ? '#ffc107' : '#28a745',
                                }}
                            />
                        </div>

                        <div style={styles.usageStats}>
                            <div style={styles.statItem}>
                                <span style={styles.statLabel}>Used:</span>
                                <span style={styles.statValue}>{limits.current.toLocaleString()}</span>
                            </div>
                            <div style={styles.statItem}>
                                <span style={styles.statLabel}>Limit:</span>
                                <span style={styles.statValue}>{limits.limit.toLocaleString()}</span>
                            </div>
                            <div style={styles.statItem}>
                                <span style={styles.statLabel}>Remaining:</span>
                                <span style={styles.statValue}>{limits.remaining.toLocaleString()}</span>
                            </div>
                            <div style={styles.statItem}>
                                <span style={styles.statLabel}>Percentage:</span>
                                <span style={styles.statValue}>{limits.percentage}%</span>
                            </div>
                        </div>

                        {limits.exceeded && (
                            <div style={styles.warning}>
                                ⚠️ You have exceeded your API usage limit. Please upgrade your plan.
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Statistics */}
            {stats && (
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Statistics</h2>

                    <div style={styles.statsGrid}>
                        <div style={styles.statBox}>
                            <h3 style={styles.statBoxTitle}>Total Calls</h3>
                            <p style={styles.statBoxValue}>{stats.stats.totalCalls}</p>
                        </div>

                        <div style={styles.statBox}>
                            <h3 style={styles.statBoxTitle}>Success Rate</h3>
                            <p style={styles.statBoxValue}>{stats.stats.successRate}%</p>
                        </div>

                        <div style={styles.statBox}>
                            <h3 style={styles.statBoxTitle}>Avg Response Time</h3>
                            <p style={styles.statBoxValue}>{stats.stats.avgResponseTime}ms</p>
                        </div>

                        <div style={styles.statBox}>
                            <h3 style={styles.statBoxTitle}>Error Calls</h3>
                            <p style={styles.statBoxValue}>{stats.stats.errorCalls}</p>
                        </div>
                    </div>

                    {/* Top Endpoints */}
                    {stats.stats.topEndpoints.length > 0 && (
                        <div style={styles.topEndpoints}>
                            <h3>Top Endpoints</h3>
                            <ul style={styles.endpointList}>
                                {stats.stats.topEndpoints.map((endpoint, index) => (
                                    <li key={index} style={styles.endpointItem}>
                                        <span>{endpoint.endpoint}</span>
                                        <span style={styles.endpointCount}>{endpoint.count} calls</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
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
    card: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        marginBottom: '25px',
    },
    cardTitle: {
        marginBottom: '20px',
    },
    progressContainer: {
        width: '100%',
        height: '30px',
        backgroundColor: '#e9ecef',
        borderRadius: '15px',
        overflow: 'hidden',
        marginBottom: '20px',
    },
    progressBar: {
        height: '100%',
        transition: 'width 0.3s ease',
    },
    usageStats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
    },
    statItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
    },
    statLabel: {
        fontWeight: '500',
    },
    statValue: {
        fontWeight: 'bold',
        color: '#007bff',
    },
    warning: {
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '4px',
        color: '#856404',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '20px',
    },
    statBox: {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
    },
    statBoxTitle: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '10px',
    },
    statBoxValue: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#007bff',
    },
    topEndpoints: {
        marginTop: '20px',
    },
    endpointList: {
        listStyle: 'none',
        padding: 0,
    },
    endpointItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px',
        borderBottom: '1px solid #e9ecef',
    },
    endpointCount: {
        fontWeight: 'bold',
        color: '#28a745',
    },
};

export default Usage;