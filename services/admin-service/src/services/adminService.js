const axios = require('axios');

class AdminService {
    constructor() {
        this.authServiceUrl = process.env.AUTH_SERVICE_URL;
        this.billingServiceUrl = process.env.BILLING_SERVICE_URL;
        this.usageServiceUrl = process.env.USAGE_SERVICE_URL;
    }

    // Get all users from auth service
    async getAllUsers() {
        try {
            // In production, auth service would have an admin endpoint
            // For now, we'll return a placeholder
            return {
                message: 'User list endpoint would be implemented in auth service',
                note: 'This requires adding an admin endpoint to auth service',
            };
        } catch (error) {
            console.error('Get all users error:', error.message);
            throw new Error('Failed to fetch users');
        }
    }

    // Get platform-wide revenue analytics
    async getRevenueAnalytics() {
        try {
            // Fetch all plans
            const plansResponse = await axios.get(`${this.billingServiceUrl}/api/plans`);
            const plans = plansResponse.data.data;

            // In production, billing service would have admin analytics endpoint
            // For now, calculate from available data
            const analytics = {
                totalPlans: plans.length,
                plans: plans.map(plan => ({
                    name: plan.name,
                    displayName: plan.displayName,
                    price: plan.price,
                    currency: plan.currency,
                    features: plan.features,
                })),
                estimatedMRR: plans.reduce((sum, plan) => {
                    // In production, multiply by active subscriber count
                    return sum + plan.price;
                }, 0),
            };

            return analytics;
        } catch (error) {
            console.error('Get revenue analytics error:', error.message);
            throw new Error('Failed to fetch revenue analytics');
        }
    }

    // Get platform-wide usage statistics
    async getUsageAnalytics() {
        try {
            // In production, usage service would have admin analytics endpoint
            return {
                message: 'Platform-wide usage analytics',
                note: 'This would aggregate usage across all users',
            };
        } catch (error) {
            console.error('Get usage analytics error:', error.message);
            throw new Error('Failed to fetch usage analytics');
        }
    }

    // Get system health status
    async getSystemHealth() {
        const services = [
            { name: 'Auth Service', url: `${this.authServiceUrl}/health` },
            { name: 'Billing Service', url: `${this.billingServiceUrl}/health` },
            { name: 'Usage Service', url: `${this.usageServiceUrl}/health` },
        ];

        const healthChecks = await Promise.allSettled(
            services.map(async (service) => {
                try {
                    const start = Date.now();
                    const response = await axios.get(service.url, { timeout: 5000 });
                    const responseTime = Date.now() - start;

                    return {
                        service: service.name,
                        status: 'healthy',
                        responseTime: `${responseTime}ms`,
                        details: response.data,
                    };
                } catch (error) {
                    return {
                        service: service.name,
                        status: 'unhealthy',
                        error: error.message,
                    };
                }
            })
        );

        const results = healthChecks.map(result =>
            result.status === 'fulfilled' ? result.value : result.reason
        );

        const allHealthy = results.every(r => r.status === 'healthy');

        return {
            overall: allHealthy ? 'healthy' : 'degraded',
            timestamp: new Date().toISOString(),
            services: results,
        };
    }

    // Get dashboard summary
    async getDashboardSummary() {
        try {
            const [revenue, health] = await Promise.all([
                this.getRevenueAnalytics(),
                this.getSystemHealth(),
            ]);

            return {
                revenue,
                systemHealth: health,
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            console.error('Get dashboard summary error:', error.message);
            throw new Error('Failed to fetch dashboard summary');
        }
    }
}

module.exports = new AdminService();