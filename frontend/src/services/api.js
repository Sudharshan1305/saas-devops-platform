import axios from 'axios';

// API Gateway URL
const API_URL = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:5000';

// Create axios instance with auth token
const createAuthAxios = () => {
    const token = localStorage.getItem('accessToken');
    return axios.create({
        baseURL: API_URL,
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
        },
    });
};

// Auth API
export const authAPI = {
    register: (data) => axios.post(`${API_URL}/api/auth/register`, data),
    login: (data) => axios.post(`${API_URL}/api/auth/login`, data),
    getProfile: () => createAuthAxios().get('/api/auth/profile'),
};

// Billing API
export const billingAPI = {
    getPlans: () => axios.get(`${API_URL}/api/plans`),
    getMySubscription: () => createAuthAxios().get('/api/subscriptions/my-subscription'),
    subscribe: (planId) => createAuthAxios().post('/api/subscriptions/subscribe', { planId }),
    createCheckoutSession: (planId) =>
        createAuthAxios().post('/api/subscriptions/create-checkout-session', { planId }),
    cancelSubscription: () => createAuthAxios().post('/api/subscriptions/cancel'),
    updateSubscription: (planId) =>
        createAuthAxios().put('/api/subscriptions/update', { planId }),
};

// Usage API
export const usageAPI = {
    getCurrentUsage: () => createAuthAxios().get('/api/usage/current'),
    getLimits: () => createAuthAxios().get('/api/usage/limits'),
    getStats: (startDate, endDate) => {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        return createAuthAxios().get('/api/usage/stats', { params });
    },
};

// Admin API
export const adminAPI = {
    getSystemHealth: () => createAuthAxios().get('/api/admin/health'),
    getRevenueAnalytics: () => createAuthAxios().get('/api/admin/analytics/revenue'),
    getDashboard: () => createAuthAxios().get('/api/admin/analytics/dashboard'),
};