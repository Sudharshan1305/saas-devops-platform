import React, { useEffect, useState } from 'react';
import { billingAPI } from '../../services/api';

function Billing() {
    const [plans, setPlans] = useState([]);
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [plansRes, subRes] = await Promise.all([
                billingAPI.getPlans(),
                billingAPI.getMySubscription(),
            ]);

            setPlans(plansRes.data.data);
            setSubscription(subRes.data.data);
        } catch (error) {
            console.error('Error fetching billing data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (planId, planName) => {
        setActionLoading(true);
        setMessage('');

        try {
            if (planName === 'FREE') {
                // Subscribe to free plan directly
                await billingAPI.subscribe(planId);
                setMessage('Successfully subscribed to Free plan!');
                fetchData();
            } else {
                // Create checkout session for paid plans
                const response = await billingAPI.createCheckoutSession(planId);
                const { url } = response.data.data;

                // Redirect to Stripe checkout
                window.location.href = url;
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Subscription failed');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancelSubscription = async () => {
        if (!window.confirm('Are you sure you want to cancel your subscription?')) {
            return;
        }

        setActionLoading(true);
        setMessage('');

        try {
            await billingAPI.cancelSubscription();
            setMessage('Subscription will be canceled at the end of billing period');
            fetchData();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Cancellation failed');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Subscription & Billing</h1>

            {message && (
                <div style={styles.message}>
                    {message}
                </div>
            )}

            {/* Current Subscription */}
            {subscription && (
                <div style={styles.currentSub}>
                    <h2>Current Subscription</h2>
                    <div style={styles.subDetails}>
                        <p><strong>Plan:</strong> {subscription.planId?.displayName}</p>
                        <p><strong>Price:</strong> ${subscription.planId?.price}/{subscription.planId?.interval}</p>
                        <p><strong>Status:</strong> <span style={styles.status}>{subscription.status}</span></p>

                        {subscription.status !== 'free' && !subscription.cancelAtPeriodEnd && (
                            <button
                                onClick={handleCancelSubscription}
                                disabled={actionLoading}
                                style={styles.cancelButton}
                            >
                                {actionLoading ? 'Processing...' : 'Cancel Subscription'}
                            </button>
                        )}

                        {subscription.cancelAtPeriodEnd && (
                            <p style={styles.cancelWarning}>
                                ⚠️ Subscription will be canceled at period end
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Available Plans */}
            <h2 style={styles.subtitle}>Available Plans</h2>
            <div style={styles.plansGrid}>
                {plans.map((plan) => (
                    <div
                        key={plan._id}
                        style={{
                            ...styles.planCard,
                            border: subscription?.planId?._id === plan._id ? '3px solid #007bff' : '1px solid #ddd',
                        }}
                    >
                        <h3 style={styles.planName}>{plan.displayName}</h3>
                        <p style={styles.planDescription}>{plan.description}</p>

                        <div style={styles.planPrice}>
                            <span style={styles.price}>${plan.price}</span>
                            <span style={styles.interval}>/{plan.interval}</span>
                        </div>

                        <div style={styles.features}>
                            <h4>Features:</h4>
                            <ul style={styles.featureList}>
                                <li>✓ {plan.features.apiCallsLimit.toLocaleString()} API calls/month</li>
                                <li>✓ {plan.features.storageLimit} GB storage</li>
                                <li>✓ {plan.features.supportLevel} support</li>
                                <li>{plan.features.customDomain ? '✓' : '✗'} Custom domain</li>
                                <li>{plan.features.analyticsAccess ? '✓' : '✗'} Analytics access</li>
                            </ul>
                        </div>

                        {subscription?.planId?._id === plan._id ? (
                            <button style={styles.currentButton} disabled>
                                Current Plan
                            </button>
                        ) : (
                            <button
                                onClick={() => handleSubscribe(plan._id, plan.name)}
                                disabled={actionLoading}
                                style={plan.name === 'FREE' ? styles.freeButton : styles.subscribeButton}
                            >
                                {actionLoading ? 'Processing...' : `Subscribe to ${plan.displayName}`}
                            </button>
                        )}
                    </div>
                ))}
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
    },
    subtitle: {
        marginTop: '40px',
        marginBottom: '20px',
    },
    message: {
        padding: '15px',
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        borderRadius: '4px',
        marginBottom: '20px',
        color: '#155724',
    },
    currentSub: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        marginBottom: '30px',
    },
    subDetails: {
        marginTop: '15px',
    },
    status: {
        textTransform: 'capitalize',
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: '15px',
        padding: '10px 20px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    cancelWarning: {
        color: '#856404',
        backgroundColor: '#fff3cd',
        padding: '10px',
        borderRadius: '4px',
        marginTop: '10px',
    },
    plansGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px',
    },
    planCard: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    planName: {
        fontSize: '24px',
        marginBottom: '10px',
    },
    planDescription: {
        color: '#666',
        marginBottom: '20px',
    },
    planPrice: {
        marginBottom: '20px',
    },
    price: {
        fontSize: '36px',
        fontWeight: 'bold',
    },
    interval: {
        fontSize: '18px',
        color: '#666',
    },
    features: {
        marginBottom: '20px',
    },
    featureList: {
        listStyle: 'none',
        padding: 0,
    },
    subscribeButton: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    freeButton: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    currentButton: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
    },
};

export default Billing;